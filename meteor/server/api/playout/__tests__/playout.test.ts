import _ from 'underscore'
import '../../../../__mocks__/_extendJest'
import { testInFiber } from '../../../../__mocks__/helpers/jest'
import { fixSnapshot } from '../../../../__mocks__/helpers/snapshot'
import { mockupCollection, resetMockupCollection } from '../../../../__mocks__/helpers/lib'
import {
	setupDefaultStudioEnvironment,
	DefaultEnvironment,
	setupDefaultRundownPlaylist,
	setupMockPeripheralDevice,
	setupRundownWithAutoplayPart0,
} from '../../../../__mocks__/helpers/database'
import { Rundowns, Rundown } from '../../../../lib/collections/Rundowns'
import '../api'
import { Timeline as OrgTimeline } from '../../../../lib/collections/Timeline'
import { ServerPlayoutAPI } from '../playout'
import { RundownPlaylists, RundownPlaylist } from '../../../../lib/collections/RundownPlaylists'
import { PeripheralDevice } from '../../../../lib/collections/PeripheralDevices'
import { PeripheralDeviceCommands } from '../../../../lib/collections/PeripheralDeviceCommands'
import { Pieces } from '../../../../lib/collections/Pieces'
import { AdLibPieces } from '../../../../lib/collections/AdLibPieces'
import { PeripheralDeviceAPI } from '../../../../lib/api/peripheralDevice'
import { PartInstances, PartInstanceId, PartInstance } from '../../../../lib/collections/PartInstances'
import { IngestActions } from '../../ingest/actions'
import { TriggerReloadDataResponse } from '../../../../lib/api/userActions'
import { protectString } from '../../../../lib/lib'
import { PieceInstances } from '../../../../lib/collections/PieceInstances'
import * as lib from '../../../../lib/lib'
import { ClientAPI } from '../../../../lib/api/client'
import { ServerRundownAPI } from '../../rundown'
import { MethodContext } from '../../../../lib/api/methods'
import { VerifiedRundownPlaylistContentAccess } from '../../lib'

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

function DEFAULT_ACCESS(playlist: RundownPlaylist): VerifiedRundownPlaylistContentAccess {
	return { userId: null, organizationId: null, studioId: null, playlist: playlist, cred: {} }
}

describe('Playout API', () => {
	let env: DefaultEnvironment
	let playoutDevice: PeripheralDevice
	const origGetCurrentTime = lib.getCurrentTime

	function getPeripheralDeviceCommands(device: PeripheralDevice) {
		return PeripheralDeviceCommands.find({ deviceId: device._id }, { sort: { time: 1 } }).fetch()
	}
	function getAllRundownData(rundown: Rundown) {
		return {
			parts: rundown.getParts(),
			segments: rundown.getSegments(),
			rundown: Rundowns.findOne(rundown._id) as Rundown,
			pieces: Pieces.find({ rundown: rundown._id }, { sort: { _id: 1 } }).fetch(),
			adLibPieces: AdLibPieces.find({ rundown: rundown._id }, { sort: { _id: 1 } }).fetch(),
		}
	}
	function getAllPartInstances() {
		return PartInstances.find({}).fetch()
	}
	function getAllPieceInstances() {
		return PieceInstances.find({}).fetch()
	}
	function getAllPieceInstancesForPartInstance(partInstanceId: PartInstanceId) {
		return PieceInstances.find({
			partInstanceId: partInstanceId,
		}).fetch()
	}
	let Timeline = mockupCollection(OrgTimeline)
	beforeAll(() => {
		Timeline = mockupCollection(OrgTimeline)
	})
	beforeEach(async () => {
		env = await setupDefaultStudioEnvironment()
		playoutDevice = setupMockPeripheralDevice(
			PeripheralDeviceAPI.DeviceCategory.PLAYOUT,
			PeripheralDeviceAPI.DeviceType.PLAYOUT,
			PeripheralDeviceAPI.SUBTYPE_PROCESS,
			env.studio
		)
		// @ts-ignore
		Timeline.insert.mockClear()
		// @ts-ignore
		Timeline.upsert.mockClear()
		// @ts-ignore
		Timeline.update.mockClear()

		jest.clearAllMocks()
	})
	afterEach(() => {
		//@ts-ignore restore getCurrentTime to original
		lib.getCurrentTime = origGetCurrentTime
	})
	afterAll(() => {
		// Clean up after ourselves:
		resetMockupCollection(OrgTimeline)
	})
	testInFiber('Basic rundown control', async () => {
		const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(env)
		expect(rundownId0).toBeTruthy()
		expect(playlistId0).toBeTruthy()

		const getRundown0 = () => {
			return Rundowns.findOne(rundownId0) as Rundown
		}
		const getPlaylist0 = () => {
			const playlist = RundownPlaylists.findOne(playlistId0) as RundownPlaylist
			playlist.activationId = playlist.activationId ?? undefined
			return playlist
		}
		const parts = getRundown0().getParts()

		expect(getPlaylist0()).toMatchObject({
			activationId: undefined,
			rehearsal: false,
		})

		expect(Timeline.bulkWriteAsync).not.toHaveBeenCalled()

		await ServerPlayoutAPI.resetRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0)

		expect(Timeline.bulkWriteAsync).not.toHaveBeenCalled()

		const orgRundownData = getAllRundownData(getRundown0())

		{
			// Prepare and activate:
			await ServerPlayoutAPI.activateRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0, false)

			const { currentPartInstance, nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			expect(currentPartInstance).toBeFalsy()
			expect(nextPartInstance).toBeTruthy()
			expect(nextPartInstance!.part._id).toEqual(parts[0]._id)

			expect(getPlaylist0()).toMatchObject({
				activationId: expect.stringMatching(/^randomId/),
				rehearsal: false,
				currentPartInstanceId: null,
				// nextPartInstanceId: parts[0]._id,
			})
		}

		expect(Timeline.bulkWriteAsync).toHaveBeenCalled()
		// expect(Timeline.update).toHaveBeenCalled() - complete replacement of timeline with single object
		Timeline.mockClear()

		{
			// Take the first Part:
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist0()),
				playlistId0,
				getPlaylist0().currentPartInstanceId
			)

			const { currentPartInstance, nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			expect(currentPartInstance).toBeTruthy()
			expect(nextPartInstance).toBeTruthy()
			expect(currentPartInstance!.part._id).toEqual(parts[0]._id)
			expect(nextPartInstance!.part._id).toEqual(parts[1]._id)
		}

		// expect(Timeline.insert).toHaveBeenCalled() - complete replacement of timeline with single object
		expect(Timeline.bulkWriteAsync).toHaveBeenCalled()
		Timeline.mockClear()

		expect(fixSnapshot(Timeline.find().fetch())).toMatchSnapshot()
		expect(fixSnapshot(getRundown0())).toMatchSnapshot()

		await expect(
			ServerPlayoutAPI.resetRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0)
		).rejects.toMatchToString(/resetRundownPlaylist can only be run in rehearsal!/gi)

		// Deactivate rundown:
		await ServerPlayoutAPI.deactivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0)
		expect(getPlaylist0()).toMatchObject({
			activationId: undefined,
			currentPartInstanceId: null,
			nextPartInstanceId: null,
		})

		expect(fixSnapshot(Timeline.find().fetch())).toMatchSnapshot()
		expect(fixSnapshot(getPlaylist0())).toMatchSnapshot()
		expect(fixSnapshot(getRundown0())).toMatchSnapshot()

		// expect(Timeline.insert).toHaveBeenCalled() - complete replacement of timeline with single object
		expect(Timeline.bulkWriteAsync).toHaveBeenCalled()

		// lastly: reset rundown
		await ServerPlayoutAPI.resetRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0)

		// Verify that the data is back to as it was before any of the operations:
		const rundownData = getAllRundownData(getRundown0())
		expect(rundownData).toEqual(orgRundownData)
	})
	testInFiber('prepareRundownPlaylistForBroadcast', async () => {
		const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(env)
		expect(rundownId0).toBeTruthy()
		expect(playlistId0).toBeTruthy()

		// const getRundown0 = () => {
		// 	return Rundowns.findOne(rundownId0) as Rundown
		// }
		const getPlaylist0 = () => {
			const playlist = RundownPlaylists.findOne(playlistId0) as RundownPlaylist
			playlist.activationId = playlist.activationId ?? undefined
			return playlist
		}
		const getPlaylist1 = () => {
			const playlist = RundownPlaylists.findOne(playlistId1) as RundownPlaylist
			playlist.activationId = playlist.activationId ?? undefined
			return playlist
		}

		expect(getPlaylist0()).toMatchObject({
			activationId: undefined,
			rehearsal: false,
		})

		expect(getPeripheralDeviceCommands(playoutDevice)).toHaveLength(0)

		// Prepare and activate in rehersal:
		await ServerPlayoutAPI.prepareRundownPlaylistForBroadcast(DEFAULT_ACCESS(getPlaylist0()), playlistId0)

		expect(getPlaylist0()).toMatchObject({
			activationId: expect.stringMatching(/^randomId/),
			rehearsal: true,
		})

		expect(getPeripheralDeviceCommands(playoutDevice)).toHaveLength(1)
		expect(getPeripheralDeviceCommands(playoutDevice)[0]).toMatchObject({
			functionName: 'devicesMakeReady',
		})

		await expect(
			ServerPlayoutAPI.prepareRundownPlaylistForBroadcast(DEFAULT_ACCESS(getPlaylist0()), playlistId0)
		).rejects.toMatchToString(/cannot be run on an active/i)

		const { playlistId: playlistId1 } = setupDefaultRundownPlaylist(env)
		await expect(
			ServerPlayoutAPI.prepareRundownPlaylistForBroadcast(DEFAULT_ACCESS(getPlaylist1()), playlistId1)
		).rejects.toMatchToString(/only one [\w\s]+ can be active at the same time/i)
	})
	testInFiber(
		'resetAndActivateRundownPlaylist, forceResetAndActivateRundownPlaylist & deactivateRundownPlaylist',
		async () => {
			const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(env)
			const { rundownId: rundownId1, playlistId: playlistId1 } = setupDefaultRundownPlaylist(env)
			expect(rundownId0).toBeTruthy()
			expect(playlistId0).toBeTruthy()
			expect(rundownId1).toBeTruthy()
			expect(playlistId1).toBeTruthy()

			// const getRundown0 = () => {
			// 	return Rundowns.findOne(rundownId0) as Rundown
			// }
			const getPlaylist0 = () => {
				const playlist = RundownPlaylists.findOne(playlistId0) as RundownPlaylist
				playlist.activationId = playlist.activationId ?? undefined
				return playlist
			}
			const getRundown1 = () => {
				return Rundowns.findOne(rundownId1) as Rundown
			}
			const getPlaylist1 = () => {
				const playlist = RundownPlaylists.findOne(playlistId1) as RundownPlaylist
				playlist.activationId = playlist.activationId ?? undefined
				return playlist
			}

			expect(getPlaylist0()).toMatchObject({
				activationId: undefined,
				rehearsal: false,
			})
			expect(getPlaylist1()).toMatchObject({
				activationId: undefined,
				rehearsal: false,
			})

			expect(getPeripheralDeviceCommands(playoutDevice)).toHaveLength(0)

			// Prepare and activate in rehersal:
			await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0, true)

			expect(getPlaylist0()).toMatchObject({
				activationId: expect.stringMatching(/^randomId/),
				rehearsal: true,
			})
			expect(getPlaylist1()).toMatchObject({
				activationId: undefined,
			})

			expect(getPeripheralDeviceCommands(playoutDevice)).toHaveLength(1)
			expect(getPeripheralDeviceCommands(playoutDevice)[0]).toMatchObject({
				functionName: 'devicesMakeReady',
			})

			{
				// Take the first Part:
				await ServerPlayoutAPI.takeNextPart(
					DEFAULT_ACCESS(getPlaylist0()),
					playlistId0,
					getPlaylist0().currentPartInstanceId
				)

				const { currentPartInstance, nextPartInstance } = getPlaylist0().getSelectedPartInstances()
				expect(currentPartInstance).toBeTruthy()
				expect(nextPartInstance).toBeTruthy()
			}

			await ServerPlayoutAPI.forceResetAndActivateRundownPlaylist(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				true
			)
			expect(getPlaylist0()).toMatchObject({
				activationId: undefined,
			})
			expect(getPlaylist1()).toMatchObject({
				activationId: expect.stringMatching(/^randomId/),
				rehearsal: true,
			})

			expect(getPeripheralDeviceCommands(playoutDevice)).toHaveLength(2)
			expect(getPeripheralDeviceCommands(playoutDevice)[1]).toMatchObject({
				functionName: 'devicesMakeReady',
			})

			// Attempt to take the first Part of inactive playlist0, should throw
			await expect(
				ServerPlayoutAPI.takeNextPart(
					DEFAULT_ACCESS(getPlaylist0()),
					playlistId0,
					getPlaylist0().currentPartInstanceId
				)
			).rejects.toMatchToString(/is not active/gi)

			// Take the first Part of active playlist1:
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !!partInstance.isTaken && !partInstance.reset
				)
			).toHaveLength(1)
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.isTaken && !partInstance.reset
				)
			).toHaveLength(1)

			await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist1()), playlistId1, true)

			// Take the first Part of active playlist1 again:
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// still should only contain a single taken instance, as rehearsal partInstances should be removed
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !!partInstance.isTaken && !partInstance.reset
				)
			).toHaveLength(1)
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.isTaken && !partInstance.reset
				)
			).toHaveLength(1)

			await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist1()), playlistId1, false)

			// Take the first Part of active playlist1 once more:
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// Take the second Part of active playlist1 so that we have more pieceInstances to reset
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// should throw with 402 code, as resetting the rundown when active is forbidden, with default configuration
			await expect(
				ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist1()), playlistId1, false)
			).rejects.toMatchToString(/cannot be run when active/gi)

			await ServerPlayoutAPI.deactivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist1()), playlistId1)

			await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist1()), playlistId1, false)

			// should contain two nonreset pieceInstance (from the first part)
			expect(
				getAllPieceInstances().filter(
					(pieceInstance) => pieceInstance.rundownId === rundownId1 && !pieceInstance.reset
				)
			).toHaveLength(2)

			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// should contain one nonreset taken partInstance
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.reset && partInstance.isTaken
				)
			).toHaveLength(1)

			// should contain three non-reset pieceInstance (two from the first part, one from the second)
			expect(
				getAllPieceInstances().filter(
					(pieceInstance) => pieceInstance.rundownId === rundownId1 && !pieceInstance.reset
				)
			).toHaveLength(3)

			// take the second part
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// Setting as next a part that is previous

			// set and take first Part again
			await ServerPlayoutAPI.setNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getRundown1().getParts()[0]._id
			)
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// take the second part to check if we reset all previous partInstances correctly
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// should contain two nonreset taken partInstances
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.reset && partInstance.isTaken
				)
			).toHaveLength(2)

			// should contain one nonreset untaken partInstance
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.reset && !partInstance.isTaken
				)
			).toHaveLength(1)

			// should contain three nonreset pieceInstances
			expect(
				getAllPieceInstances().filter(
					(pieceInstance) => pieceInstance.rundownId === rundownId1 && !pieceInstance.reset
				)
			).toHaveLength(3)

			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// Setting as next a non-previous and non-current part:

			// set and take first Part again
			await ServerPlayoutAPI.setNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getRundown1().getParts()[0]._id
			)
			await ServerPlayoutAPI.takeNextPart(
				DEFAULT_ACCESS(getPlaylist1()),
				playlistId1,
				getPlaylist1().currentPartInstanceId
			)

			// should contain two nonreset taken instance
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.reset && partInstance.isTaken
				)
			).toHaveLength(2)

			// should contain one nonreset untaken partInstance (next)
			expect(
				getAllPartInstances().filter(
					(partInstance) =>
						partInstance.rundownId === rundownId1 && !partInstance.reset && !partInstance.isTaken
				)
			).toHaveLength(1)

			// should contain three nonreset pieceInstance
			expect(
				getAllPieceInstances().filter(
					(pieceInstance) => pieceInstance.rundownId === rundownId1 && !pieceInstance.reset
				)
			).toHaveLength(3)
		}
	)
	testInFiber('reloadRundownPlaylistData', async () => {
		// mock reloadRundown for test
		const origReloadRundown = IngestActions.reloadRundown
		IngestActions.reloadRundown = jest.fn(() => TriggerReloadDataResponse.COMPLETED)

		expect(() => {
			ServerRundownAPI.resyncRundownPlaylist(DEFAULT_CONTEXT, protectString('fake_id'))
		}).toThrowError(/not found/gi)

		const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(env)
		ServerRundownAPI.resyncRundownPlaylist(DEFAULT_CONTEXT, playlistId0)

		expect(IngestActions.reloadRundown).toHaveBeenCalled()
		expect((IngestActions.reloadRundown as jest.Mock).mock.calls[0][0]).toMatchObject({
			_id: rundownId0,
		})

		IngestActions.reloadRundown = origReloadRundown
	})
	testInFiber(
		'onPartPlaybackStarted, onPiecePlaybackStarted, onPartPlaybackStopped, onPiecePlaybackStopped',
		async () => {
			const TIME_RANDOM = 5
			const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(
				env,
				undefined,
				setupRundownWithAutoplayPart0
			)
			expect(rundownId0).toBeTruthy()
			expect(playlistId0).toBeTruthy()

			// const getRundown0 = () => {
			// 	return Rundowns.findOne(rundownId0) as Rundown
			// }
			const getPlaylist0 = () => {
				return RundownPlaylists.findOne(playlistId0) as RundownPlaylist
			}

			// Prepare and activate in rehersal:
			await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0, true)

			expect(getPlaylist0()).toMatchObject({
				activationId: expect.stringMatching(/^randomId/),
				rehearsal: true,
			})

			const parts = getPlaylist0().getAllOrderedParts()

			// just any time, such as 2020-01-01 12:00:00
			let now = new Date(2020, 0, 1, 12, 0, 0).getTime()

			//@ts-ignore set up a mock for this test
			lib.getCurrentTime = jest.fn(() => {
				return now
			})

			{
				// Take the first Part:
				await ServerPlayoutAPI.takeNextPart(
					DEFAULT_ACCESS(getPlaylist0()),
					playlistId0,
					getPlaylist0().currentPartInstanceId
				)

				const { currentPartInstance, nextPartInstance } = getPlaylist0().getSelectedPartInstances()
				expect(currentPartInstance).toBeTruthy()
				expect(nextPartInstance).toBeTruthy()
				expect(currentPartInstance?.part._id).toBe(parts[0]._id)
				expect(currentPartInstance?.part.autoNext).toBe(true) // the current part should autonext
				expect(currentPartInstance?.part.expectedDuration).toBeGreaterThan(0)
				expect(nextPartInstance?.part._id).toBe(parts[1]._id)

				// simulate TSR starting part playback
				const currentPartInstanceId = currentPartInstance?._id || protectString('')
				await ServerPlayoutAPI.onPartPlaybackStarted(
					DEFAULT_CONTEXT,
					playoutDevice,
					playlistId0,
					currentPartInstanceId,
					now
				)

				// simulate TSR starting each piece
				const pieceInstances = getAllPieceInstancesForPartInstance(currentPartInstanceId)
				expect(pieceInstances).toHaveLength(2)
				await Promise.all(
					pieceInstances.map(async (pieceInstance) =>
						ServerPlayoutAPI.onPiecePlaybackStarted(
							DEFAULT_CONTEXT,
							playlistId0,
							pieceInstance._id,
							false,
							(_.isNumber(pieceInstance.piece.enable.start)
								? now + pieceInstance.piece.enable.start
								: now) +
								Math.random() * TIME_RANDOM
						)
					)
				)
			}

			{
				// the rundown timings are set
				const playlist = getPlaylist0()
				expect(playlist.startedPlayback).toBe(now)

				// the currentPartInstance timings are set
				const currentPartInstance = playlist.getSelectedPartInstances().currentPartInstance as PartInstance
				expect(currentPartInstance).toBeTruthy()
				expect(currentPartInstance.timings?.startedPlayback).toBe(now)

				// the piece instances timings are set
				const pieceInstances = getAllPieceInstancesForPartInstance(currentPartInstance._id)
				expect(pieceInstances).toHaveLength(2)
				pieceInstances.forEach((pieceInstance) => {
					expect(pieceInstance.startedPlayback).toBeTruthy()
					expect(pieceInstance.startedPlayback).toBeWithinRange(now, now + TIME_RANDOM)
				})
			}

			{
				const nowBuf = now
				const { currentPartInstance } = getPlaylist0().getSelectedPartInstances()
				expect(currentPartInstance?.part.expectedDuration).toBeTruthy()
				now += (currentPartInstance?.part.expectedDuration ?? 0) - 500
				// try to take just before an autonext
				const response = await ServerPlayoutAPI.takeNextPart(
					DEFAULT_ACCESS(getPlaylist0()),
					playlistId0,
					getPlaylist0().currentPartInstanceId
				)
				expect(response).toBeTruthy()
				expect((response as ClientAPI.ClientResponseError).message).toMatch(/cannot take shortly before/gi)
				now = nowBuf
			}

			{
				// simulate an autonext
				const {
					currentPartInstance: currentPartInstanceBeforeTake,
					nextPartInstance: nextPartInstanceBeforeTake,
				} = getPlaylist0().getSelectedPartInstances()
				const currentPartInstanceBeforeTakeId = currentPartInstanceBeforeTake?._id
				const nextPartInstanceBeforeTakeId = nextPartInstanceBeforeTake?._id

				expect(currentPartInstanceBeforeTake?.part.expectedDuration).toBeTruthy()
				now += currentPartInstanceBeforeTake?.part.expectedDuration ?? 0
				await ServerPlayoutAPI.onPartPlaybackStarted(
					DEFAULT_CONTEXT,
					playoutDevice,
					playlistId0,
					nextPartInstanceBeforeTakeId!,
					now
				)
				await ServerPlayoutAPI.onPartPlaybackStopped(
					DEFAULT_CONTEXT,
					playlistId0,
					currentPartInstanceBeforeTakeId!,
					now
				)
				const pieceInstances = getAllPieceInstancesForPartInstance(currentPartInstanceBeforeTakeId!)
				expect(pieceInstances).toHaveLength(2)
				await Promise.all(
					pieceInstances.map(async (pieceInstance) =>
						ServerPlayoutAPI.onPiecePlaybackStopped(
							DEFAULT_CONTEXT,
							playlistId0,
							pieceInstance._id,
							false,
							(_.isNumber(pieceInstance.piece.enable.start)
								? now + pieceInstance.piece.enable.start
								: now) +
								Math.random() * TIME_RANDOM
						)
					)
				)

				const {
					currentPartInstance: currentPartInstanceAfterTake,
					nextPartInstance: nextPartInstanceAfterTake,
				} = getPlaylist0().getSelectedPartInstances()
				expect(currentPartInstanceAfterTake).toBeTruthy()
				expect(currentPartInstanceAfterTake?.part._id).toBe(parts[1]._id)
				expect(nextPartInstanceAfterTake).toBeTruthy()
				expect(nextPartInstanceAfterTake?.part._id).toBe(parts[2]._id)

				const previousPartInstanceAfterTake = PartInstances.findOne(currentPartInstanceBeforeTakeId)
				expect(previousPartInstanceAfterTake).toBeTruthy()
				expect(previousPartInstanceAfterTake?.timings?.stoppedPlayback).toBe(now)

				const pieceInstances2 = getAllPieceInstancesForPartInstance(currentPartInstanceBeforeTakeId!)
				pieceInstances2.forEach((pieceInstance) => {
					expect(pieceInstance.stoppedPlayback).toBeWithinRange(now, now + TIME_RANDOM)
				})
			}
		}
	)
	testInFiber('moveNextPart', async () => {
		const { rundownId: rundownId0, playlistId: playlistId0 } = setupDefaultRundownPlaylist(
			env,
			undefined,
			setupRundownWithAutoplayPart0
		)
		expect(rundownId0).toBeTruthy()
		expect(playlistId0).toBeTruthy()

		// const getRundown0 = () => {
		// 	return Rundowns.findOne(rundownId0) as Rundown
		// }
		const getPlaylist0 = () => {
			return RundownPlaylists.findOne(playlistId0) as RundownPlaylist
		}
		const parts = getPlaylist0().getAllOrderedParts()

		// Prepare and activate in rehersal:
		await ServerPlayoutAPI.resetAndActivateRundownPlaylist(DEFAULT_ACCESS(getPlaylist0()), playlistId0, true)

		{
			// expect first part to be selected as next
			const { currentPartInstance, nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			expect(currentPartInstance).toBeFalsy()
			expect(getPlaylist0()).toMatchObject({
				activationId: expect.stringMatching(/^randomId/),
				rehearsal: true,
			})
			expect(nextPartInstance?.part._id).toBe(parts[0]._id)
		}

		{
			// move horizontally +1
			await ServerPlayoutAPI.moveNextPart(DEFAULT_ACCESS(getPlaylist0()), playlistId0, 1, 0)
			const { nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			// expect second part to be selected as next
			expect(nextPartInstance?.part._id).toBe(parts[1]._id)
		}

		{
			// move horizontally -1
			await ServerPlayoutAPI.moveNextPart(DEFAULT_ACCESS(getPlaylist0()), playlistId0, -1, 0)
			const { nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			// expect first part to be selected as next
			expect(nextPartInstance?.part._id).toBe(parts[0]._id)
		}

		{
			// move vertically +1
			await ServerPlayoutAPI.moveNextPart(DEFAULT_ACCESS(getPlaylist0()), playlistId0, 0, 1)
			const { nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			// expect 3rd part to be selected as next
			expect(nextPartInstance?.part._id).toBe(parts[2]._id)
		}

		{
			// move vertically -1
			await ServerPlayoutAPI.moveNextPart(DEFAULT_ACCESS(getPlaylist0()), playlistId0, 0, -1)
			const { nextPartInstance } = getPlaylist0().getSelectedPartInstances()
			// expect 1st part to be selected as next
			expect(nextPartInstance?.part._id).toBe(parts[0]._id)
		}
	})
})
