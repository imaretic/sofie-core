import { ReadonlyDeep } from 'type-fest'
import { DBPartInstance, wrapPartToTemporaryInstance } from '../../../../lib/collections/PartInstances'
import { DBPart } from '../../../../lib/collections/Parts'
import { RundownPlaylist, RundownPlaylistId, RundownPlaylists } from '../../../../lib/collections/RundownPlaylists'
import { Rundown, Rundowns } from '../../../../lib/collections/Rundowns'
import { getRandomId, protectString } from '../../../../lib/lib'
import {
	DefaultEnvironment,
	setupDefaultStudioEnvironment,
	setupDefaultRundownPlaylist,
} from '../../../../__mocks__/helpers/database'
import { beforeEachInFiber, testInFiber } from '../../../../__mocks__/helpers/jest'
import { VerifiedRundownPlaylistContentAccess } from '../../lib'
import { CacheForPlayout, getOrderedSegmentsAndPartsFromPlayoutCache } from '../cache'
import { canContinueAdlibOnEndInfinites } from '../infinites'
import { runPlayoutOperationWithCache, PlayoutLockFunctionPriority } from '../lockFunction'

function DEFAULT_ACCESS(rundownPlaylistID: RundownPlaylistId): VerifiedRundownPlaylistContentAccess {
	const playlist = RundownPlaylists.findOne(rundownPlaylistID) as RundownPlaylist
	expect(playlist).toBeTruthy()
	return { userId: null, organizationId: null, studioId: null, playlist: playlist, cred: {} }
}

describe('canContinueAdlibOnEndInfinites', () => {
	let env: DefaultEnvironment

	beforeEachInFiber(() => {
		env = setupDefaultStudioEnvironment()
	})

	function wrapWithCache<T>(fcn: (cache: CacheForPlayout, playlist: ReadonlyDeep<RundownPlaylist>) => T) {
		const defaultSetup = setupDefaultRundownPlaylist(env)

		// Mark playlist as active
		RundownPlaylists.update(defaultSetup.playlistId, {
			$set: {
				activationId: getRandomId(),
			},
		})

		const tmpPlaylist = RundownPlaylists.findOne(defaultSetup.playlistId) as RundownPlaylist
		expect(tmpPlaylist).toBeTruthy()

		const rundown = Rundowns.findOne(defaultSetup.rundownId) as Rundown
		expect(rundown).toBeTruthy()

		return runPlayoutOperationWithCache(
			null,
			'test',
			tmpPlaylist._id,
			PlayoutLockFunctionPriority.USER_PLAYOUT,
			null,
			(cache) => fcn(cache, cache.Playlist.doc)
		)
	}

	testInFiber('Basic case', () => {
		wrapWithCache((cache, playlist) => {
			const orderedPartsAndSegments = getOrderedSegmentsAndPartsFromPlayoutCache(cache)
			expect(orderedPartsAndSegments.parts.length).toBeGreaterThan(2)

			// At beginning
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0]),
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[1])
				)
			).toBeTruthy()

			// Small gap
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0]),
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[2])
				)
			).toBeTruthy()

			// At end
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 2]
					),
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 1]
					)
				)
			).toBeTruthy()

			// Start to end
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0]),
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 1]
					)
				)
			).toBeTruthy()
		})
	})

	testInFiber('No previousPartInstance', () => {
		wrapWithCache((cache, playlist) => {
			const orderedPartsAndSegments = getOrderedSegmentsAndPartsFromPlayoutCache(cache)

			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					undefined,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[1])
				)
			).toBeFalsy()
		})
	})

	testInFiber('Is before', () => {
		wrapWithCache((cache, playlist) => {
			const orderedPartsAndSegments = getOrderedSegmentsAndPartsFromPlayoutCache(cache)
			expect(orderedPartsAndSegments.parts.length).toBeGreaterThan(2)

			// At beginning
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[1]),
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0])
				)
			).toBeFalsy()

			// At end
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 1]
					),
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 2]
					)
				)
			).toBeFalsy()

			// Start to end
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(
						playlist.activationId!,
						orderedPartsAndSegments.parts[orderedPartsAndSegments.parts.length - 1]
					),
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0])
				)
			).toBeFalsy()
		})
	})

	testInFiber('Orphaned PartInstance', () => {
		wrapWithCache((cache, playlist) => {
			const orderedPartsAndSegments = getOrderedSegmentsAndPartsFromPlayoutCache(cache)
			expect(orderedPartsAndSegments.parts.length).toBeGreaterThan(2)

			const candidatePart = wrapPartToTemporaryInstance(playlist.activationId!, {
				...orderedPartsAndSegments.parts[0],
			})
			candidatePart.part._rank = candidatePart.part._rank + 0.1
			candidatePart.part._id = protectString(candidatePart.part._id + '2')
			candidatePart.orphaned = 'adlib-part'

			// After first
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[0]),
					candidatePart
				)
			).toBeTruthy()

			// Before second
			expect(
				canContinueAdlibOnEndInfinites(
					playlist,
					orderedPartsAndSegments.segments,
					wrapPartToTemporaryInstance(playlist.activationId!, orderedPartsAndSegments.parts[1]),
					candidatePart
				)
			).toBeFalsy()
		})
	})
})