import { Meteor } from 'meteor/meteor'
import { PeripheralDeviceAPI, PeripheralDeviceAPIMethods } from '../../../../lib/api/peripheralDevice'
import { setupDefaultStudioEnvironment, setupMockPeripheralDevice } from '../../../../__mocks__/helpers/database'
import { Rundowns, Rundown } from '../../../../lib/collections/Rundowns'
import { PeripheralDevice } from '../../../../lib/collections/PeripheralDevices'
import { testInFiber } from '../../../../__mocks__/helpers/jest'
import { DBSegment, Segment, SegmentId, SegmentOrphanedReason, Segments } from '../../../../lib/collections/Segments'
import { Part, Parts } from '../../../../lib/collections/Parts'
import {
	IngestRundown,
	IngestSegment,
	IngestPart,
	IBlueprintPiece,
	PieceLifespan,
} from '@sofie-automation/blueprints-integration'
import { ServerRundownAPI } from '../../rundown'
import { ServerPlayoutAPI } from '../../playout/playout'
import { RundownInput } from '../rundownInput'
import { RundownPlaylists, RundownPlaylist, RundownPlaylistId } from '../../../../lib/collections/RundownPlaylists'
import { PartInstance, PartInstanceId, PartInstances } from '../../../../lib/collections/PartInstances'
import { MethodContext } from '../../../../lib/api/methods'
import { removeRundownPlaylistFromDb } from '../../rundownPlaylist'
import { Random } from 'meteor/random'
import { VerifiedRundownPlaylistContentAccess } from '../../lib'
import { Pieces } from '../../../../lib/collections/Pieces'
import { PieceInstances } from '../../../../lib/collections/PieceInstances'
import { getRandomId, literal, protectString } from '../../../../lib/lib'
import { Settings } from '../../../../lib/Settings'
import { waitAllQueued } from '../../../codeControl'
import { PlayoutLockFunctionPriority, runPlayoutOperationWithCache } from '../../playout/lockFunction'
import { getSelectedPartInstancesFromCache } from '../../playout/cache'
import { ServerPlayoutAdLibAPI } from '../../playout/adlib'

require('../../peripheralDevice.ts') // include in order to create the Meteor methods needed

const DEFAULT_CONTEXT: MethodContext = {
	userId: null,
	isSimulation: false,
	connection: {
		id: 'mockConnectionId',
		close: () => {},
		onClose: () => {},
		clientAddress: '127.0.0.1',
		httpHeaders: {},
	},
	setUserId: () => {},
	unblock: () => {},
}

function PLAYLIST_ACCESS(rundownPlaylistID: RundownPlaylistId): VerifiedRundownPlaylistContentAccess {
	const playlist = RundownPlaylists.findOne(rundownPlaylistID) as RundownPlaylist
	expect(playlist).toBeTruthy()
	return { userId: null, organizationId: null, studioId: null, playlist: playlist, cred: {} }
}

describe('Test ingest actions for rundowns and segments', () => {
	let device: PeripheralDevice
	let device2: PeripheralDevice
	const externalId = 'abcde'
	const segExternalId = 'zyxwv'
	beforeAll(async () => {
		const env = await setupDefaultStudioEnvironment()
		device = env.ingestDevice

		device2 = setupMockPeripheralDevice(
			PeripheralDeviceAPI.DeviceCategory.INGEST,
			// @ts-ignore
			'mockDeviceType',
			PeripheralDeviceAPI.SUBTYPE_PROCESS,
			env.studio
		)
	})

	beforeEach(() => {
		Settings.preserveUnsyncedPlayingSegmentContents = false
	})

	testInFiber('dataRundownCreate', () => {
		// setLogLevel(LogLevel.DEBUG)

		expect(Rundowns.findOne()).toBeFalsy()

		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part0',
							name: 'Part 0',
							rank: 0,
						},
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment1',
					name: 'Segment 1',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
					],
				},
			],
		}

		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData)

		const rundownPlaylist = RundownPlaylists.findOne() as RundownPlaylist
		const rundown = Rundowns.findOne() as Rundown
		expect(rundownPlaylist).toMatchObject({
			externalId: rundown._id,
		})

		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
			playlistId: rundownPlaylist._id,
		})

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(2)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(2)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)
	})

	testInFiber('dataRundownUpdate change name', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundownRenamed',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part0',
							name: 'Part 0',
							rank: 0,
						},
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment1',
					name: 'Segment 1',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)

		const rundownPlaylist = RundownPlaylists.findOne() as RundownPlaylist
		const rundown = Rundowns.findOne() as Rundown
		expect(rundownPlaylist).toMatchObject({
			externalId: rundown._id,
			name: rundownData.name,
		})
		expect(RundownPlaylists.find().count()).toBe(1)

		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
			name: rundownData.name,
			playlistId: rundownPlaylist._id,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(2)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(2)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)
	})

	testInFiber('dataRundownUpdate add a segment', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part0',
							name: 'Part 0',
							rank: 0,
						},
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment1',
					name: 'Segment 1',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)

		const rundown = Rundowns.findOne() as Rundown
		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(2)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)

		const parts2 = Parts.find({ rundownId: rundown._id, segmentId: segments[2]._id }).fetch()
		expect(parts2).toHaveLength(1)
	})

	testInFiber('dataRundownUpdate add a part', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part0',
							name: 'Part 0',
							rank: 0,
						},
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment1',
					name: 'Segment 1',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
						{
							externalId: 'partZ',
							name: 'Part Z',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)

		const rundownPlaylist = RundownPlaylists.findOne() as RundownPlaylist
		const rundown = Rundowns.findOne() as Rundown
		expect(rundownPlaylist).toMatchObject({
			externalId: rundown._id,
		})
		expect(RundownPlaylists.find().count()).toBe(1)

		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(2)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(2)
		expect(parts1.map((x) => x.title)).toEqual(['Part 2', 'Part Z'])

		const parts2 = Parts.find({ rundownId: rundown._id, segmentId: segments[2]._id }).fetch()
		expect(parts2).toHaveLength(1)
	})

	testInFiber('dataRundownUpdate remove a segment', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part0',
							name: 'Part 0',
							rank: 0,
						},
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)

		const rundownPlaylist = RundownPlaylists.findOne() as RundownPlaylist
		const rundown = Rundowns.findOne() as Rundown
		expect(rundownPlaylist).toMatchObject({
			externalId: rundown._id,
		})
		expect(RundownPlaylists.find().count()).toBe(1)

		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(2)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(2)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)
	})

	testInFiber('dataRundownUpdate remove a part', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)

		const rundown = Rundowns.findOne() as Rundown
		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(2)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(1)
		expect(parts0[0].externalId).toBe('part1')

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)
	})

	testInFiber('dataRundownMetaDataUpdate change name, does not remove segments', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		const rundownData: Omit<IngestRundown, 'segments'> = {
			externalId: externalId,
			name: 'MyMockRundownRenamed',
			type: 'mock',
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownMetaDataUpdate, device._id, device.token, rundownData)

		const rundownPlaylist = RundownPlaylists.findOne() as RundownPlaylist
		const rundown = Rundowns.findOne() as Rundown
		expect(rundownPlaylist).toMatchObject({
			externalId: rundown._id,
			name: rundownData.name,
		})
		expect(RundownPlaylists.find().count()).toBe(1)

		expect(rundown).toMatchObject({
			externalId: rundownData.externalId,
			name: rundownData.name,
			playlistId: rundownPlaylist._id,
		})
		expect(Rundowns.find().count()).toBe(1)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(2)

		const parts0 = Parts.find({ rundownId: rundown._id, segmentId: segments[0]._id }).fetch()
		expect(parts0).toHaveLength(1)

		const parts1 = Parts.find({ rundownId: rundown._id, segmentId: segments[1]._id }).fetch()
		expect(parts1).toHaveLength(1)
	})

	testInFiber('dataRundownDelete', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownDelete, device._id, device.token, externalId)
		expect(Rundowns.findOne()).toBeFalsy()
		expect(Segments.find().count()).toBe(0)
		expect(Parts.find().count()).toBe(0)
	})

	testInFiber('dataRundownDelete for a second time', () => {
		expect(Rundowns.findOne()).toBeFalsy()
		expect(() =>
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownDelete, device._id, device.token, externalId)
		).toThrow(/Rundown.*not found/i)
	})

	// Note: this test fails, due to a backwards-compatibility hack in #c579c8f0
	// testInFiber('dataRundownDelete bad device', () => {
	// 	expect(Rundowns.findOne()).toBeFalsy()
	// 	try {
	// 		Meteor.call(
	// 			PeripheralDeviceAPIMethods.dataRundownDelete,
	// 			unprotectString(device._id).slice(0, -1),
	// 			device.token,
	// 			externalId
	// 		)
	// 		fail('expected to throw')
	// 	} catch (e) {
	// 		expect(e.message).toBe('[404] PeripheralDevice "mockDevice" not found')
	// 	}
	// 	try {
	// 		Meteor.call(PeripheralDeviceAPIMethods.dataRundownDelete, device._id, device.token.slice(0, -1), externalId)
	// 		fail('expected to throw')
	// 	} catch (e) {
	// 		expect(e.message).toBe('[401] Not allowed access to peripheralDevice')
	// 	}
	// })

	// Reject update when no preceeding create
	testInFiber('dataRundownUpdate when not yet created', () => {
		expect(Rundowns.findOne()).toBeFalsy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}

		expect(() =>
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)
		).toThrow(/Rundown.*not found/)
		expect(Rundowns.findOne()).toBeFalsy()
	})

	testInFiber('dataRundownUpdate fail when rundown is orphaned', () => {
		expect(Rundowns.findOne()).toBeFalsy()
		const rundownData0: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}

		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData0)
		expect(Rundowns.findOne()).toBeTruthy()
		Rundowns.update({}, { $set: { orphaned: 'deleted' } })

		const rundown0 = Rundowns.findOne() as Rundown
		expect(rundown0.orphaned).toEqual('deleted')
		expect(Segments.find({ rundownId: rundown0._id }).count()).toBe(2)

		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
			],
		}

		Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device._id, device.token, rundownData)
		const rundown = Rundowns.findOne() as Rundown
		expect(rundown.orphaned).toEqual('deleted')
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
	})

	testInFiber('dataRundownCreate replace orphaned rundown', () => {
		expect(Rundowns.find({ orphaned: 'deleted' }).count()).toEqual(1)

		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData)
		expect(Rundowns.find({ orphaned: 'deleted' }).count()).toEqual(0)
	})

	testInFiber('dataSegmentCreate in deleted rundown', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		Rundowns.update({}, { $set: { orphaned: 'deleted' } })

		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, externalId, ingestSegment)

		const segment = Segments.find({ externalId: segExternalId }).fetch()
		expect(segment).toHaveLength(0)
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
	})

	testInFiber('dataSegmentCreate', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		Rundowns.update({}, { $unset: { orphaned: 1 } })

		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, externalId, ingestSegment)

		const segment = Segments.find({ externalId: segExternalId }).fetch()
		expect(segment).toHaveLength(1)
		expect(segment[0]).toMatchObject({
			externalId: ingestSegment.externalId,
			name: 'MyMockSegment',
		})

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)
	})

	testInFiber('dataSegmentCreate replace deleted segment', () => {
		expect(Rundowns.findOne()).toBeTruthy()
		Rundowns.update({}, { $unset: { orphaned: 1 } })

		const segment0 = Segments.find({ externalId: segExternalId }).fetch()
		expect(segment0).toHaveLength(1)
		Segments.update(segment0[0]._id, { $set: { orphaned: SegmentOrphanedReason.DELETED } })

		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)
		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment2',
			rank: 0,
			parts: [],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, externalId, ingestSegment)

		const segment = Segments.find({ externalId: segExternalId }).fetch()
		expect(segment).toHaveLength(1)
		expect(segment[0]).toMatchObject({
			name: 'MyMockSegment2',
		})
	})

	testInFiber('dataSegmentUpdate add a part', () => {
		const rundown = Rundowns.findOne() as Rundown
		Segments.update({ rundownId: rundown._id }, { $unset: { orphaned: 1 } })
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [
				{
					externalId: 'part42',
					name: 'Part 42',
					rank: 0,
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, externalId, ingestSegment)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)

		const parts3 = Parts.find({ rundownId: rundown._id, segmentId: segments[2]._id }).fetch()
		expect(parts3).toHaveLength(1)
		expect(parts3[0]).toMatchObject({
			externalId: 'part42',
			title: 'Part 42',
		})
	})

	testInFiber('dataSegmentUpdate deleted segment', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		Segments.update({ rundownId: rundown._id }, { $set: { orphaned: SegmentOrphanedReason.DELETED } })
		const segmentBefore = Segments.findOne({ externalId: segExternalId }) as Segment

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment2',
			rank: 0,
			parts: [
				{
					externalId: 'part423',
					name: 'Part 423',
					rank: 0,
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, externalId, ingestSegment)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)
		// Ensure no changes
		expect(Segments.findOne({ externalId: segExternalId })).toMatchObject(segmentBefore)
	})

	testInFiber('dataSegmentUpdate deleted rundown', () => {
		const rundown = Rundowns.findOne() as Rundown
		Rundowns.update({}, { $set: { orphaned: 'deleted' } })
		Segments.update({ rundownId: rundown._id }, { $unset: { orphaned: 1 } })
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		const segmentBefore = Segments.findOne({ externalId: segExternalId }) as Segment

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment2',
			rank: 0,
			parts: [
				{
					externalId: 'part423',
					name: 'Part 423',
					rank: 0,
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, externalId, ingestSegment)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)
		// Ensure no changes
		expect(Segments.findOne({ externalId: segExternalId })).toMatchObject(segmentBefore)
	})

	testInFiber('dataSegmentUpdate non-existant rundown', () => {
		const segExternalId2 = Random.id()
		const ingestSegment: IngestSegment = {
			externalId: segExternalId2,
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}

		expect(Segments.findOne({ externalId: segExternalId2 })).toBeFalsy()

		expect(() =>
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, 'wibble', ingestSegment)
		).toThrow(/Rundown.*not found/)
		expect(Segments.findOne({ externalId: segExternalId2 })).toBeFalsy()
	})

	testInFiber('dataSegmentUpdate no change', () => {
		const rundown = Rundowns.findOne() as Rundown
		Rundowns.update({}, { $unset: { orphaned: 1 } })
		Segments.update({ rundownId: rundown._id }, { $unset: { orphaned: 1 } })
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [
				{
					externalId: 'part42',
					name: 'Part 42',
					rank: 0,
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, externalId, ingestSegment)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)

		const parts3 = Parts.find({ rundownId: rundown._id, segmentId: segments[2]._id }).fetch()
		expect(parts3).toHaveLength(1)
		expect(parts3[0]).toMatchObject({
			externalId: 'part42',
			title: 'Part 42',
		})
	})

	testInFiber('dataSegmentUpdate remove a part', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentUpdate, device._id, device.token, externalId, ingestSegment)

		const segments = Segments.find({ rundownId: rundown._id }).fetch()
		expect(segments).toHaveLength(3)

		const parts3 = Parts.find({ rundownId: rundown._id, segmentId: segments[2]._id }).fetch()
		expect(parts3).toHaveLength(0)
	})

	testInFiber('dataSegmentUpdate no external id', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)
		const ingestSegment: IngestSegment = {
			externalId: '',
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}
		expect(() =>
			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device._id,
				device.token,
				externalId,
				ingestSegment
			)
		).toThrow(`[401] getSegmentId: segmentExternalId must be set!`)
	})

	testInFiber('dataSegmentDelete already orphaned segment', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id, externalId: segExternalId }).count()).toBe(1)

		Rundowns.update({}, { $unset: { orphaned: 1 } })
		Segments.update(
			{ rundownId: rundown._id, externalId: segExternalId },
			{ $set: { orphaned: SegmentOrphanedReason.DELETED } }
		)

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentDelete, device._id, device.token, externalId, segExternalId)

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)
		expect(Segments.findOne({ externalId: segExternalId })).toBeTruthy()
	})

	testInFiber('dataSegmentDelete in deleted rundown', () => {
		// reset rundown
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
					],
				},
				{
					externalId: segExternalId,
					name: 'Segment 3',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData)

		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id, externalId: segExternalId }).count()).toBe(1)

		Rundowns.update({}, { $set: { orphaned: 'deleted' } })
		Segments.update({ rundownId: rundown._id }, { $unset: { orphaned: 1 } })

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentDelete, device._id, device.token, externalId, segExternalId)

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)
		expect(Segments.findOne({ externalId: segExternalId })).toBeTruthy()
	})

	testInFiber('dataSegmentDelete', () => {
		// reset rundown
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 0,
					parts: [
						{
							externalId: 'part1',
							name: 'Part 1',
							rank: 0,
						},
					],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 0,
					parts: [
						{
							externalId: 'part2',
							name: 'Part 2',
							rank: 0,
						},
					],
				},
				{
					externalId: segExternalId,
					name: 'Segment 3',
					rank: 0,
					parts: [
						{
							externalId: 'part3',
							name: 'Part 3',
							rank: 0,
						},
					],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData)

		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(3)

		Rundowns.update({}, { $unset: { orphaned: 1 } })
		Segments.update({ rundownId: rundown._id }, { $unset: { orphaned: 1 } })

		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentDelete, device._id, device.token, externalId, segExternalId)

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
		expect(Segments.findOne({ externalId: segExternalId })).toBeFalsy()
	})

	testInFiber('dataSegmentDelete for a second time', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id, externalId: segExternalId }).count()).toBe(0)

		expect(() =>
			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentDelete,
				device._id,
				device.token,
				externalId,
				segExternalId
			)
		).toThrow(`[404] Rundown "${externalId}" does not have a Segment "${segExternalId}" to remove`)

		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)
	})

	testInFiber('dataSegmentDelete from non-existant rundown', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(Segments.find({ rundownId: rundown._id }).count()).toBe(2)

		expect(() =>
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentDelete, device._id, device.token, 'wibble', segExternalId)
		).toThrow(/Rundown.*not found/i)
	})

	testInFiber('dataSegmentCreate non-existant rundown', () => {
		const rundown = Rundowns.findOne() as Rundown
		expect(rundown).toBeTruthy()

		const ingestSegment: IngestSegment = {
			externalId: segExternalId,
			name: 'MyMockSegment',
			rank: 0,
			parts: [],
		}
		expect(() =>
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, 'wibble', ingestSegment)
		).toThrow(/not found/)
	})

	testInFiber('dataRundownCreate with not enough arguments', () => {
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, null)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})

	testInFiber('dataSegmentCreate with not enough arguments', () => {
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, externalId)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
		try {
			Meteor.call(PeripheralDeviceAPIMethods.dataSegmentCreate, device._id, device.token, externalId, null)
			expect(0).toBe(1)
		} catch (e) {
			expect(e).toBeTruthy()
		}
	})

	testInFiber('dataPartCreate', () => {
		const rundown = Rundowns.findOne() as Rundown
		const segment = Segments.findOne({ externalId: 'segment0' }) as Segment
		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(1)

		const ingestPart: IngestPart = {
			externalId: 'party',
			name: 'Part Y',
			rank: 0,
		}

		Meteor.call(
			PeripheralDeviceAPIMethods.dataPartCreate,
			device._id,
			device.token,
			externalId,
			segment.externalId,
			ingestPart
		)

		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(2)

		const part = Parts.findOne({ externalId: 'party' }) as Part
		expect(part).toMatchObject({
			externalId: ingestPart.externalId,
			title: ingestPart.name,
		})
	})

	testInFiber('dataPartUpdate', () => {
		const rundown = Rundowns.findOne() as Rundown
		const segment = Segments.findOne({ externalId: 'segment0' }) as Segment
		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(2)

		const ingestPart: IngestPart = {
			externalId: 'party',
			name: 'Part Z',
			rank: 0,
		}

		Meteor.call(
			PeripheralDeviceAPIMethods.dataPartUpdate,
			device._id,
			device.token,
			externalId,
			segment.externalId,
			ingestPart
		)

		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(2)

		const part = Parts.findOne({ externalId: 'party' }) as Part
		expect(part).toMatchObject({
			externalId: ingestPart.externalId,
			title: ingestPart.name,
		})
	})

	testInFiber('dataPartDelete', () => {
		const rundown = Rundowns.findOne() as Rundown
		const segment = Segments.findOne({ rundownId: rundown._id, externalId: 'segment0' }) as Segment
		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(2)

		Meteor.call(
			PeripheralDeviceAPIMethods.dataPartDelete,
			device._id,
			device.token,
			externalId,
			segment.externalId,
			'party'
		)

		expect(Parts.find({ rundownId: rundown._id, segmentId: segment._id }).count()).toBe(1)
		expect(Parts.findOne({ externalId: 'party' })).toBeFalsy()
	})

	// TODO Part tests are minimal/happy path only on the assumption the API gets little use

	testInFiber('dataSegmentRanksUpdate', () => {
		Rundowns.remove({})
		expect(Rundowns.findOne()).toBeFalsy()
		const rundownData: IngestRundown = {
			externalId: externalId,
			name: 'MyMockRundown',
			type: 'mock',
			segments: [
				{
					externalId: 'segment0',
					name: 'Segment 0',
					rank: 1,
					// payload?: any,
					parts: [],
				},
				{
					externalId: 'segment1',
					name: 'Segment 1',
					rank: 2,
					// payload?: any,
					parts: [],
				},
				{
					externalId: 'segment2',
					name: 'Segment 2',
					rank: 3,
					// payload?: any,
					parts: [],
				},
				{
					externalId: 'segment3',
					name: 'Segment 3',
					rank: 4,
					// payload?: any,
					parts: [],
				},
				{
					externalId: 'segment4',
					name: 'Segment 4',
					rank: 5,
					// payload?: any,
					parts: [],
				},
				{
					externalId: 'segment5',
					name: 'Segment 5',
					rank: 6,
					// payload?: any,
					parts: [],
				},
			],
		}
		Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device._id, device.token, rundownData)

		const playlist = RundownPlaylists.findOne() as RundownPlaylist
		expect(playlist).toBeTruthy()

		const rundown = Rundowns.findOne() as Rundown
		expect(rundown).toBeTruthy()

		Meteor.call(PeripheralDeviceAPIMethods.dataSegmentRanksUpdate, device._id, device.token, externalId, {
			['segment0']: 6,
			['segment2']: 1,
			['segment5']: 3,
		})

		expect(Segments.findOne({ externalId: 'segment0' })?._rank).toBe(6)
		expect(Segments.findOne({ externalId: 'segment1' })?._rank).toBe(2)
		expect(Segments.findOne({ externalId: 'segment2' })?._rank).toBe(1)
		expect(Segments.findOne({ externalId: 'segment3' })?._rank).toBe(4)
		expect(Segments.findOne({ externalId: 'segment4' })?._rank).toBe(5)
		expect(Segments.findOne({ externalId: 'segment5' })?._rank).toBe(3)
	})

	testInFiber('unsyncing of rundown', async () => {
		try {
			// Cleanup any rundowns / playlists

			await Promise.all(
				RundownPlaylists.find()
					.fetch()
					.map(async (p) => removeRundownPlaylistFromDb(p))
			)

			const rundownData: IngestRundown = {
				externalId: externalId,
				name: 'MyMockRundown',
				type: 'mock',
				segments: [
					{
						externalId: 'segment0',
						name: 'Segment 0',
						rank: 0,
						parts: [
							{
								externalId: 'part0',
								name: 'Part 0',
								rank: 0,
							},
							{
								externalId: 'part1',
								name: 'Part 1',
								rank: 0,
							},
						],
					},
					{
						externalId: 'segment1',
						name: 'Segment 1',
						rank: 0,
						parts: [
							{
								externalId: 'part2',
								name: 'Part 2',
								rank: 0,
							},
						],
					},
				],
			}

			// Preparation: set up rundown
			expect(Rundowns.findOne()).toBeFalsy()
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device2._id, device2.token, rundownData)
			const rundown = Rundowns.findOne() as Rundown
			expect(rundown).toMatchObject({
				externalId: rundownData.externalId,
			})
			const playlist = rundown.getRundownPlaylist()
			expect(playlist).toBeTruthy()

			const getRundown = () => Rundowns.findOne(rundown._id) as Rundown
			const getPlaylist = () => rundown.getRundownPlaylist() as RundownPlaylist
			const getSegment = (id: SegmentId) => Segments.findOne(id) as Segment
			const resyncRundown = () => {
				try {
					ServerRundownAPI.resyncRundown(DEFAULT_CONTEXT, rundown._id)
				} catch (e) {
					if (e.toString().match(/does not support the method "reloadRundown"/)) {
						// This is expected

						Meteor.call(
							PeripheralDeviceAPIMethods.dataRundownCreate,
							device2._id,
							device2.token,
							rundownData
						)
						return
					}
					throw e
				}
			}

			const segments = getRundown().getSegments()
			const parts = getRundown().getParts()

			expect(segments).toHaveLength(2)
			expect(parts).toHaveLength(3)

			// Activate the rundown, make data updates and verify that it gets unsynced properly
			await ServerPlayoutAPI.activateRundownPlaylist(PLAYLIST_ACCESS(playlist._id), playlist._id, true)
			expect(getRundown().orphaned).toBeUndefined()

			await RundownInput.dataRundownDelete(DEFAULT_CONTEXT, device2._id, device2.token, rundownData.externalId)
			expect(getRundown().orphaned).toEqual('deleted')

			resyncRundown()
			expect(getRundown().orphaned).toBeUndefined()

			await ServerPlayoutAPI.takeNextPart(
				PLAYLIST_ACCESS(playlist._id),
				playlist._id,
				playlist.currentPartInstanceId
			)
			const partInstance = PartInstances.find({ 'part._id': parts[0]._id }).fetch()
			expect(partInstance).toHaveLength(1)
			expect(getPlaylist().currentPartInstanceId).toEqual(partInstance[0]._id)
			expect(partInstance[0].segmentId).toEqual(segments[0]._id)

			await RundownInput.dataSegmentDelete(
				DEFAULT_CONTEXT,
				device2._id,
				device2.token,
				rundownData.externalId,
				segments[0].externalId
			)
			expect(getRundown().orphaned).toBeUndefined()
			expect(getSegment(segments[0]._id).orphaned).toEqual(SegmentOrphanedReason.DELETED)

			resyncRundown()
			expect(getRundown().orphaned).toBeUndefined()
			expect(getSegment(segments[0]._id).orphaned).toBeUndefined()

			await RundownInput.dataPartDelete(
				DEFAULT_CONTEXT,
				device2._id,
				device2.token,
				rundownData.externalId,
				segments[0].externalId,
				parts[0].externalId
			)
			expect(getRundown().orphaned).toBeUndefined()
			expect(getSegment(segments[0]._id).orphaned).toBeUndefined()

			resyncRundown()
			expect(getRundown().orphaned).toBeUndefined()
			expect(getSegment(segments[0]._id).orphaned).toBeUndefined()
		} finally {
			// forcefully 'deactivate' the playlist to allow for cleanup to happen
			RundownPlaylists.update({}, { $unset: { activationId: 1 } }, { multi: true })
		}
	})

	testInFiber('replace the nexted part', async () => {
		try {
			// Cleanup any rundowns / playlists
			await Promise.all(
				RundownPlaylists.find()
					.fetch()
					.map(async (p) => removeRundownPlaylistFromDb(p))
			)

			const rundownData: IngestRundown = {
				externalId: externalId,
				name: 'MyMockRundown',
				type: 'mock',
				segments: [
					{
						externalId: 'segment0',
						name: 'Segment 0',
						rank: 0,
						parts: [
							{
								externalId: 'part0',
								name: 'Part 0',
								rank: 0,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece0',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
							{
								externalId: 'part1',
								name: 'Part 1',
								rank: 1,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece1',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
						],
					},
					{
						externalId: 'segment1',
						name: 'Segment 1',
						rank: 1,
						parts: [
							{
								externalId: 'part2',
								name: 'Part 2',
								rank: 0,
							},
						],
					},
				],
			}

			// Preparation: set up rundown
			expect(Rundowns.findOne()).toBeFalsy()
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device2._id, device2.token, rundownData)
			const rundown = Rundowns.findOne() as Rundown
			expect(rundown).toMatchObject({
				externalId: rundownData.externalId,
			})
			const playlist = rundown.getRundownPlaylist()
			expect(playlist).toBeTruthy()

			const getRundown = () => Rundowns.findOne(rundown._id) as Rundown
			const getPlaylist = () => rundown.getRundownPlaylist() as RundownPlaylist

			const segments = getRundown().getSegments()
			const parts = getRundown().getParts()

			expect(segments).toHaveLength(2)
			expect(parts).toHaveLength(3)
			expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)

			// Activate the rundown, make data updates and verify that it gets unsynced properly
			await ServerPlayoutAPI.activateRundownPlaylist(PLAYLIST_ACCESS(playlist._id), playlist._id, true)
			expect(getPlaylist().currentPartInstanceId).toBeNull()

			// Take the first part
			await ServerPlayoutAPI.takeNextPart(
				PLAYLIST_ACCESS(playlist._id),
				playlist._id,
				playlist.currentPartInstanceId
			)
			expect(getPlaylist().currentPartInstanceId).not.toBeNull()

			{
				// Check which parts are current and next
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				const nextPartInstance = selectedInstances.nextPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
				expect(nextPartInstance).toBeTruthy()
				expect(nextPartInstance.part.externalId).toBe('part1')

				// we should have some pieces
				expect(PieceInstances.find({ partInstanceId: nextPartInstance._id }).fetch()).not.toHaveLength(0)
			}

			// Replace part1 with a new part
			const updatedSegmentData: IngestSegment = rundownData.segments[0]
			updatedSegmentData.parts[1].externalId = 'new-part'

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegmentData
			)
			{
				const segments2 = getRundown().getSegments()
				const parts2 = getRundown().getParts()

				expect(segments2).toHaveLength(2)
				expect(parts2).toHaveLength(3)

				expect(parts2.find((p) => p.externalId === 'part1')).toBeFalsy()
				const newPart = parts2.find((p) => p.externalId === 'new-part') as Part
				expect(newPart).toBeTruthy()

				expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)

				// we need some pieces for the test to work
				expect(Pieces.find({ startPartId: newPart._id }).fetch()).not.toHaveLength(0)
			}

			{
				// Check if the partInstance was updated
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				const nextPartInstance = selectedInstances.nextPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
				expect(nextPartInstance).toBeTruthy()
				expect(nextPartInstance.part.externalId).toBe('new-part')

				// the pieces should have been copied
				expect(PieceInstances.find({ partInstanceId: nextPartInstance._id }).fetch()).not.toHaveLength(0)
			}
		} finally {
			// forcefully 'deactivate' the playlist to allow for cleanup to happen
			RundownPlaylists.update({}, { $unset: { activationId: 1 } }, { multi: true })
		}
	})

	testInFiber('previous partinstance getting removed if an adlib part', async () => {
		try {
			// Cleanup any rundowns / playlists
			await Promise.all(
				RundownPlaylists.find()
					.fetch()
					.map(async (p) => removeRundownPlaylistFromDb(p))
			)

			const rundownData: IngestRundown = {
				externalId: externalId,
				name: 'MyMockRundown',
				type: 'mock',
				segments: [
					{
						externalId: 'segment0',
						name: 'Segment 0',
						rank: 0,
						parts: [
							{
								externalId: 'part0',
								name: 'Part 0',
								rank: 0,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece0',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
							{
								externalId: 'part1',
								name: 'Part 1',
								rank: 1,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece1',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
						],
					},
					{
						externalId: 'segment1',
						name: 'Segment 1',
						rank: 1,
						parts: [
							{
								externalId: 'part2',
								name: 'Part 2',
								rank: 0,
							},
						],
					},
					{
						externalId: 'segment2',
						name: 'Segment 2',
						rank: 1,
						parts: [
							{
								externalId: 'part3',
								name: 'Part 3',
								rank: 0,
							},
						],
					},
				],
			}
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device2._id, device2.token, rundownData)

			const rundown = Rundowns.findOne() as Rundown
			expect(rundown).toBeTruthy()

			// Take into first part
			await ServerPlayoutAPI.activateRundownPlaylist(
				PLAYLIST_ACCESS(rundown.playlistId),
				rundown.playlistId,
				true
			)
			await ServerPlayoutAPI.takeNextPart(PLAYLIST_ACCESS(rundown.playlistId), rundown.playlistId, null)

			const doQueuePart = async (partInstanceId: PartInstanceId): Promise<void> =>
				runPlayoutOperationWithCache(
					PLAYLIST_ACCESS(rundown.playlistId),
					'adlib-part',
					rundown.playlistId,
					PlayoutLockFunctionPriority.USER_PLAYOUT,
					null,
					async (cache) => {
						const rundown0 = cache.Rundowns.findOne() as Rundown
						expect(rundown0).toBeTruthy()

						const currentPartInstance = getSelectedPartInstancesFromCache(cache)
							.currentPartInstance as PartInstance
						expect(currentPartInstance).toBeTruthy()

						const newPartInstance = new PartInstance({
							_id: partInstanceId,
							rundownId: rundown0._id,
							segmentId: currentPartInstance.segmentId,
							playlistActivationId: currentPartInstance.playlistActivationId,
							segmentPlayoutId: currentPartInstance.segmentPlayoutId,
							takeCount: currentPartInstance.takeCount + 1,
							rehearsal: true,
							part: new Part({
								_id: protectString(`${partInstanceId}_part`),
								_rank: 0,
								rundownId: rundown0._id,
								segmentId: currentPartInstance.segmentId,
								externalId: `${partInstanceId}_externalId`,
								title: 'New part',
							}),
						})

						// Simulate a queued part
						await ServerPlayoutAdLibAPI.innerStartQueuedAdLib(
							cache,
							rundown0,
							currentPartInstance,
							newPartInstance,
							[]
						)
					}
				)

			// Queue and take an adlib-part
			const partInstanceId0: PartInstanceId = getRandomId()
			await doQueuePart(partInstanceId0)
			{
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()

				await ServerPlayoutAPI.takeNextPart(
					PLAYLIST_ACCESS(rundown.playlistId),
					rundown.playlistId,
					playlist.currentPartInstanceId
				)
			}

			{
				// Verify it was taken properly
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()
				expect(playlist.currentPartInstanceId).toBe(partInstanceId0)

				const currentPartInstance = playlist.getSelectedPartInstances().currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.orphaned).toBe('adlib-part')
			}

			// Ingest update should have no effect
			const ingestSegment: IngestSegment = {
				externalId: 'segment2',
				name: 'Segment 2a',
				rank: 1,
				parts: [
					{
						externalId: 'part3',
						name: 'Part 3',
						rank: 0,
					},
				],
			}

			{
				// Check props before
				const segment2 = Segments.findOne({
					externalId: ingestSegment.externalId,
					rundownId: rundown._id,
				}) as Segment
				expect(segment2).toBeTruthy()
				expect(segment2.name).not.toBe(ingestSegment.name)
			}

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				ingestSegment
			)

			{
				// Check props after
				const segment2 = Segments.findOne({
					externalId: ingestSegment.externalId,
					rundownId: rundown._id,
				}) as Segment
				expect(segment2).toBeTruthy()
				expect(segment2.name).toBe(ingestSegment.name)
			}

			{
				// Verify the adlibbed part-instance didnt change
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()
				expect(playlist.currentPartInstanceId).toBe(partInstanceId0)

				const currentPartInstance = playlist.getSelectedPartInstances().currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.orphaned).toBe('adlib-part')
			}

			// Queue and take another adlib-part
			const partInstanceId1: PartInstanceId = getRandomId()
			await doQueuePart(partInstanceId1)
			{
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()

				await ServerPlayoutAPI.takeNextPart(
					PLAYLIST_ACCESS(rundown.playlistId),
					rundown.playlistId,
					playlist.currentPartInstanceId
				)
			}

			{
				// Verify the take was correct
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()
				expect(playlist.currentPartInstanceId).toBe(partInstanceId1)
				expect(playlist.previousPartInstanceId).toBe(partInstanceId0)

				const currentPartInstance = playlist.getSelectedPartInstances().currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.orphaned).toBe('adlib-part')

				const previousPartInstance = playlist.getSelectedPartInstances().previousPartInstance as PartInstance
				expect(previousPartInstance).toBeTruthy()
				expect(previousPartInstance.orphaned).toBe('adlib-part')
			}

			// Another ingest update
			ingestSegment.name += '2'

			{
				// Check props before
				const segment2 = Segments.findOne({
					externalId: ingestSegment.externalId,
					rundownId: rundown._id,
				}) as Segment
				expect(segment2).toBeTruthy()
				expect(segment2.name).not.toBe(ingestSegment.name)
			}

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				ingestSegment
			)

			{
				// Check props after
				const segment2 = Segments.findOne({
					externalId: ingestSegment.externalId,
					rundownId: rundown._id,
				}) as Segment
				expect(segment2).toBeTruthy()
				expect(segment2.name).toBe(ingestSegment.name)
			}

			{
				// Verify the part-instances havent changed
				const playlist = RundownPlaylists.findOne(rundown.playlistId) as RundownPlaylist
				expect(playlist).toBeTruthy()
				expect(playlist.currentPartInstanceId).toBe(partInstanceId1)
				expect(playlist.previousPartInstanceId).toBe(partInstanceId0)

				const currentPartInstance = playlist.getSelectedPartInstances().currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.orphaned).toBe('adlib-part')

				const previousPartInstance = playlist.getSelectedPartInstances().previousPartInstance as PartInstance
				expect(previousPartInstance).toBeTruthy()
				expect(previousPartInstance.orphaned).toBe('adlib-part')
			}
		} finally {
			// forcefully 'deactivate' the playlist to allow for cleanup to happen
			RundownPlaylists.update({}, { $unset: { activationId: 1 } }, { multi: true })
		}
	})

	testInFiber('prevent hiding current segment', async () => {
		try {
			// Cleanup any rundowns / playlists
			await Promise.all(
				RundownPlaylists.find()
					.fetch()
					.map(async (p) => removeRundownPlaylistFromDb(p))
			)

			Settings.preserveUnsyncedPlayingSegmentContents = true
			const rundownData: IngestRundown = {
				externalId: externalId,
				name: 'MyMockRundown',
				type: 'mock',
				segments: [
					{
						externalId: 'segment0',
						name: 'Segment 0',
						rank: 0,
						payload: {},
						parts: [
							{
								externalId: 'part0',
								name: 'Part 0',
								rank: 0,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece0',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
							{
								externalId: 'part1',
								name: 'Part 1',
								rank: 1,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece1',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
						],
					},
					{
						externalId: 'segment1',
						name: 'Segment 1',
						rank: 1,
						payload: {},
						parts: [
							{
								externalId: 'part2',
								name: 'Part 2',
								rank: 0,
							},
						],
					},
				],
			}

			// Preparation: set up rundown
			expect(Rundowns.findOne()).toBeFalsy()
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device2._id, device2.token, rundownData)
			const rundown = Rundowns.findOne() as Rundown
			expect(rundown).toMatchObject({
				externalId: rundownData.externalId,
			})
			const playlist = rundown.getRundownPlaylist()
			expect(playlist).toBeTruthy()

			const getRundown = () => Rundowns.findOne(rundown._id) as Rundown
			const getPlaylist = () => rundown.getRundownPlaylist() as RundownPlaylist

			const segments = getRundown().getSegments()
			const parts = getRundown().getParts()

			expect(segments).toHaveLength(2)
			expect(parts).toHaveLength(3)
			expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)

			// Activate the rundown
			await ServerPlayoutAPI.activateRundownPlaylist(PLAYLIST_ACCESS(playlist._id), playlist._id, true)
			expect(getPlaylist().currentPartInstanceId).toBeNull()

			// Take the first part
			await ServerPlayoutAPI.takeNextPart(PLAYLIST_ACCESS(playlist._id), playlist._id, null)
			expect(getPlaylist().currentPartInstanceId).not.toBeNull()

			{
				// Check which part is current
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
			}

			// Hide segment 1, while not on air
			const updatedSegment1Data: IngestSegment = rundownData.segments[1]
			updatedSegment1Data.payload.hidden = true

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegment1Data
			)
			{
				const segments = getRundown().getSegments()

				expect(segments).toHaveLength(2)

				const segment1 = segments.find((s) => s.externalId === updatedSegment1Data.externalId)
				expect(segment1?.isHidden).toBeTruthy()
				expect(segment1?.orphaned).toBeFalsy()
			}

			// Un-hide segment 1
			updatedSegment1Data.payload.hidden = false

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegment1Data
			)
			{
				const segments = getRundown().getSegments()
				expect(segments).toHaveLength(2)
				const segment1 = segments.find((s) => s.externalId === updatedSegment1Data.externalId)
				expect(segment1?.isHidden).toBeFalsy()
				expect(segment1?.orphaned).toBeFalsy()
			}

			// Replace segment0 with empty hidden segment, while on air
			const updatedSegment0Data: IngestSegment = rundownData.segments[0]
			updatedSegment0Data.payload.hidden = true
			const oldParts = updatedSegment0Data.parts
			updatedSegment0Data.parts = []

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegment0Data
			)
			{
				// Check the segment has been preserved
				const segments = getRundown().getSegments()
				const parts2 = getRundown().getParts()

				expect(segments).toHaveLength(2)

				const segment0 = segments.find((s) => s.externalId === updatedSegment0Data.externalId)
				expect(segment0?.isHidden).toBeFalsy()
				expect(segment0?.orphaned).toEqual(SegmentOrphanedReason.HIDDEN)

				expect(parts2).toHaveLength(3)
				expect(parts2.find((p) => p.externalId === 'part1')).toBeTruthy()

				expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)
			}

			{
				// Check the partInstance
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
			}

			// Unhide the segment while on air
			updatedSegment0Data.parts = oldParts
			delete updatedSegment0Data.payload['hidden']

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegment0Data
			)
			{
				// Check the segment is still preserved and un-hidden
				const segments2 = getRundown().getSegments()
				const parts2 = getRundown().getParts()

				expect(segments2).toHaveLength(2)
				const segment0 = segments2.find((s) => s.externalId === updatedSegment0Data.externalId)
				expect(segment0?.isHidden).toBeFalsy()
				expect(segment0?.orphaned).toBeFalsy()

				expect(parts2).toHaveLength(3)
				expect(parts2.find((p) => p.externalId === 'part1')).toBeTruthy()

				expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)
			}
			{
				// Check the partInstance
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
			}

			// Replace segment0 with empty hidden segment again
			updatedSegment0Data.payload.hidden = true
			updatedSegment0Data.parts = []

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentUpdate,
				device2._id,
				device2.token,
				rundownData.externalId,
				updatedSegment0Data
			)

			// Take Segment 1
			await ServerPlayoutAPI.takeNextPart(
				PLAYLIST_ACCESS(playlist._id),
				playlist._id,
				getPlaylist().currentPartInstanceId
			)
			expect(getPlaylist().currentPartInstanceId).not.toBeNull()
			await ServerPlayoutAPI.takeNextPart(
				PLAYLIST_ACCESS(playlist._id),
				playlist._id,
				getPlaylist().currentPartInstanceId
			)
			expect(getPlaylist().currentPartInstanceId).not.toBeNull()

			await waitAllQueued() // So that defers in cleanups had time to run.

			{
				// Check the partInstance
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part2')
			}
			{
				const segments2 = getRundown().getSegments()
				const parts2 = getRundown().getParts()

				// Check if segment 0 was hidden
				expect(segments2).toHaveLength(2)
				const segment0 = segments2.find((s) => s.externalId === updatedSegment0Data.externalId)
				expect(segment0?.isHidden).toBeTruthy()
				expect(segment0?.orphaned).toBeFalsy()

				expect(parts2).toHaveLength(1)
			}
		} finally {
			// forcefully 'deactivate' the playlist to allow for cleanup to happen
			RundownPlaylists.update({}, { $unset: { activationId: 1 } }, { multi: true })
		}
	})

	testInFiber('prevent hiding current segment', async () => {
		try {
			// Cleanup any rundowns / playlists
			await Promise.all(
				RundownPlaylists.find()
					.fetch()
					.map(async (p) => removeRundownPlaylistFromDb(p))
			)

			const rundownData: IngestRundown = {
				externalId: externalId,
				name: 'MyMockRundown',
				type: 'mock',
				segments: [
					{
						externalId: 'segment0',
						name: 'Segment 0',
						rank: 0,
						payload: {},
						parts: [
							{
								externalId: 'part0',
								name: 'Part 0',
								rank: 0,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece0',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
							{
								externalId: 'part1',
								name: 'Part 1',
								rank: 1,
								payload: {
									pieces: [
										literal<IBlueprintPiece>({
											externalId: 'piece1',
											name: '',
											enable: { start: 0 },
											sourceLayerId: '',
											outputLayerId: '',
											lifespan: PieceLifespan.WithinPart,
											content: { timelineObjects: [] },
										}),
									],
								},
							},
						],
					},
					{
						externalId: 'segment1',
						name: 'Segment 1',
						rank: 1,
						payload: {},
						parts: [
							{
								externalId: 'part2',
								name: 'Part 2',
								rank: 0,
							},
						],
					},
				],
			}

			// Preparation: set up rundown
			expect(Rundowns.findOne()).toBeFalsy()
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownCreate, device2._id, device2.token, rundownData)
			const rundown = Rundowns.findOne() as Rundown
			expect(rundown).toMatchObject({
				externalId: rundownData.externalId,
			})
			const playlist = rundown.getRundownPlaylist()
			expect(playlist).toBeTruthy()

			const getRundown = () => Rundowns.findOne(rundown._id) as Rundown
			const getPlaylist = () => rundown.getRundownPlaylist() as RundownPlaylist

			const segments = getRundown().getSegments()
			const parts = getRundown().getParts()

			expect(segments).toHaveLength(2)
			expect(parts).toHaveLength(3)
			expect(Pieces.find({ startRundownId: rundown._id }).fetch()).toHaveLength(2)

			// Activate the rundown
			await ServerPlayoutAPI.activateRundownPlaylist(PLAYLIST_ACCESS(playlist._id), playlist._id, true)
			expect(getPlaylist().currentPartInstanceId).toBeNull()

			// Take the first part
			await ServerPlayoutAPI.takeNextPart(PLAYLIST_ACCESS(playlist._id), playlist._id, null)
			expect(getPlaylist().currentPartInstanceId).not.toBeNull()

			{
				// Check which part is current
				const selectedInstances = getPlaylist().getSelectedPartInstances()
				const currentPartInstance = selectedInstances.currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.part.externalId).toBe('part0')
				expect(currentPartInstance.segmentId).toBe(segments[0]._id)
			}

			// Delete segment 0, while on air
			const segmentExternalId = rundownData.segments[0].externalId
			// const updatedSegment1Data: IngestSegment = rundownData.segments[1]
			// updatedSegment1Data.payload.hidden = true

			Meteor.call(
				PeripheralDeviceAPIMethods.dataSegmentDelete,
				device2._id,
				device2.token,
				rundownData.externalId,
				segmentExternalId
			)
			{
				const { segments, parts } = getRundown().getSegmentsAndPartsSync()
				expect(segments).toHaveLength(2)

				const segment0 = segments.find((s) => s.externalId === segmentExternalId) as DBSegment
				expect(segment0).toBeTruthy()
				expect(segment0.orphaned).toBe(SegmentOrphanedReason.DELETED)
				expect(segment0.isHidden).toBeFalsy()

				const parts0 = parts.filter((p) => p.segmentId === segment0._id)
				expect(parts0).toHaveLength(0)
			}

			console.log('pre-updated')

			// Trigger an 'resync' of the rundown
			rundownData.segments.splice(0, 1)
			Meteor.call(PeripheralDeviceAPIMethods.dataRundownUpdate, device2._id, device2.token, rundownData)

			// Make sure segment0 is still deleted
			{
				const segments = getRundown().getSegments()
				expect(segments).toHaveLength(2)

				const segment0 = segments.find((s) => s.externalId === segmentExternalId) as DBSegment
				expect(segment0).toBeTruthy()
				expect(segment0.orphaned).toBe(SegmentOrphanedReason.DELETED)
				expect(segment0.isHidden).toBeFalsy()
			}
		} finally {
			// forcefully 'deactivate' the playlist to allow for cleanup to happen
			RundownPlaylists.update({}, { $unset: { activationId: 1 } }, { multi: true })
		}
	})
})
