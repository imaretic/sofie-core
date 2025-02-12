import { Meteor } from 'meteor/meteor'
import {
	Timeline,
	getRoutedTimeline,
	RoutedTimeline,
	TimelineComplete,
	TimelineObjGeneric,
	TimelineHash,
	deserializeTimelineBlob,
	serializeTimelineBlob,
} from '../../lib/collections/Timeline'
import { meteorPublish } from './lib'
import { PubSub } from '../../lib/api/pubsub'
import { FindOptions } from '../../lib/typings/meteor'
import { CustomPublishArray, meteorCustomPublishArray } from '../lib/customPublication'
import { setUpOptimizedObserver } from '../lib/optimizedObserver'
import { PeripheralDeviceId, PeripheralDevices } from '../../lib/collections/PeripheralDevices'
import { Studios, getActiveRoutes, StudioId, ResultingMappingRoutes } from '../../lib/collections/Studios'
import { PeripheralDeviceReadAccess } from '../security/peripheralDevice'
import { StudioReadAccess } from '../security/studio'
import { fetchStudioLight, StudioLight } from '../../lib/collections/optimizations'
import { FastTrackObservers, setupFastTrackObserver } from './fastTrack'

meteorPublish(PubSub.timeline, function (selector, token) {
	if (!selector) throw new Meteor.Error(400, 'selector argument missing')
	const modifier: FindOptions<TimelineComplete> = {
		fields: {},
	}
	if (StudioReadAccess.studioContent(selector, { userId: this.userId, token })) {
		return Timeline.find(selector, modifier)
	}
	return null
})

meteorCustomPublishArray<RoutedTimeline>(
	PubSub.timelineForDevice,
	'studioTimeline',
	function (pub, deviceId: PeripheralDeviceId, token) {
		if (
			PeripheralDeviceReadAccess.peripheralDeviceContent({ deviceId: deviceId }, { userId: this.userId, token })
		) {
			const peripheralDevice = PeripheralDevices.findOne(deviceId)

			if (!peripheralDevice) throw new Meteor.Error('PeripheralDevice "' + deviceId + '" not found')

			const studioId = peripheralDevice.studioId
			if (!studioId) return []

			createObserverForTimelinePublication(pub, PubSub.timelineForDevice, studioId)
		}
	}
)

meteorCustomPublishArray<RoutedTimeline>(
	PubSub.timelineForStudio,
	'studioTimeline',
	function (pub, studioId: StudioId, token) {
		if (StudioReadAccess.studio({ _id: studioId }, { userId: this.userId, token })) {
			createObserverForTimelinePublication(pub, PubSub.timelineForStudio, studioId)
		}
	}
)

/** Create an observer for each publication, to simplify the stop conditions */
function createObserverForTimelinePublication(
	pub: CustomPublishArray<RoutedTimeline>,
	observerId: PubSub,
	studioId: StudioId
) {
	const observer = setUpOptimizedObserver(
		`pub_${observerId}_${studioId}`,
		(triggerUpdate) => {
			// Set up observers:
			return [
				Studios.find(studioId, {
					fields: {
						// It should be enough to watch the mappingsHash, since that should change whenever there is a
						// change to the mappings or the routes
						mappingsHash: 1,
					},
				}).observe({
					added: () => triggerUpdate({ invalidateStudio: true, studioId: studioId }),
					changed: () => triggerUpdate({ invalidateStudio: true, studioId: studioId }),
					removed: () => triggerUpdate({ invalidateStudio: true, studioId: null }),
				}),
				Timeline.find({
					_id: studioId,
				}).observe({
					added: (timeline) => triggerUpdate({ timeline: timeline }),
					changed: (timeline) => triggerUpdate({ timeline: timeline }),
					removed: () => triggerUpdate({ timeline: null }),
				}),
				setupFastTrackObserver(FastTrackObservers.TIMELINE, [studioId], (timeline: TimelineComplete) => {
					triggerUpdate({
						timeline: timeline,
					})
				}),
			]
		},
		() => {
			// Initial data fetch
			return {
				studioId: studioId,
				timeline: Timeline.findOne({
					_id: studioId,
				}),

				invalidateStudio: true,
				studio: undefined,
				routes: undefined,

				timelineHash: undefined,
				routedTimeline: [],
			}
		},
		(context: {
			studioId: StudioId | undefined
			timeline: TimelineComplete | undefined

			invalidateStudio: boolean
			studio: StudioLight | undefined
			routes: ResultingMappingRoutes | undefined

			// re-calc of timeline using timelineHash:
			timelineHash: TimelineHash | undefined
			routedTimeline: TimelineObjGeneric[]
		}) => {
			// Prepare data for publication:

			if (!context.studioId || !context.timeline) {
				return []
			}

			let changedData = false
			let invalidateTimeline = false

			if (context.invalidateStudio) {
				context.invalidateStudio = false
				context.studio = fetchStudioLight(context.studioId)
				context.routes = context.studio ? getActiveRoutes(context.studio) : undefined

				invalidateTimeline = true
			}
			if (!context.studio) return []
			if (!context.routes) return []

			if (context.timelineHash !== context.timeline.timelineHash) {
				invalidateTimeline = true
			}

			if (invalidateTimeline) {
				context.timelineHash = context.timeline.timelineHash
				const timeline = deserializeTimelineBlob(context.timeline.timelineBlob)
				context.routedTimeline = getRoutedTimeline(timeline, context.routes)
				changedData = true
			}

			return [
				{
					_id: context.timeline._id,
					mappingsHash: context.studio.mappingsHash,
					timelineHash: context.timeline.timelineHash,
					timelineBlob: serializeTimelineBlob(context.routedTimeline),
					generated: context.timeline.generated,
					published: Date.now(),

					changedData,
				},
			]
		},
		(newData) => {
			if (pub.isFirstRun || newData.length === 0) {
				pub.updatedDocs(newData)
			} else {
				// Only update the publication if any data has changed:
				let changedData = false
				for (const data of newData) {
					if (data.changedData) {
						changedData = true
						break
					}
				}
				if (changedData) {
					pub.updatedDocs(newData)
				}
			}
		},
		0 // ms
	)
	pub.onStop(() => {
		observer.stop()
	})
}
