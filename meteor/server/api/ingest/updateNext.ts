import { ServerPlayoutAPI } from '../playout/playout'
import { selectNextPart, isTooCloseToAutonext } from '../playout/lib'
import { profiler } from '../profiler'
import {
	CacheForPlayout,
	getOrderedSegmentsAndPartsFromPlayoutCache,
	getSelectedPartInstancesFromCache,
} from '../playout/cache'

export async function ensureNextPartIsValid(cache: CacheForPlayout): Promise<void> {
	const span = profiler.startSpan('api.ingest.ensureNextPartIsValid')

	// Ensure the next-id is still valid
	const playlist = cache.Playlist.doc
	if (playlist && playlist.activationId) {
		const { currentPartInstance, nextPartInstance } = getSelectedPartInstancesFromCache(cache)

		if (
			playlist.nextPartManual &&
			nextPartInstance?.part?.isPlayable() &&
			nextPartInstance.orphaned !== 'deleted'
		) {
			// Manual next part is almost always valid. This includes orphaned (adlib-part) partinstances
			span?.end()
			return
		}

		// If we are close to an autonext, then leave it to avoid glitches
		if (isTooCloseToAutonext(currentPartInstance) && nextPartInstance) {
			span?.end()
			return
		}

		const allPartsAndSegments = getOrderedSegmentsAndPartsFromPlayoutCache(cache)

		if (currentPartInstance && nextPartInstance) {
			// Check if the part is the same
			const newNextPart = selectNextPart(playlist, currentPartInstance, nextPartInstance, allPartsAndSegments)

			if (
				// Nothing should be nexted
				!newNextPart ||
				// The nexted-part should be different to what is selected
				newNextPart.part._id !== nextPartInstance.part._id ||
				// The nexted-part Instance is no longer playable
				!nextPartInstance.part.isPlayable()
			) {
				// The 'new' next part is before the current next, so move the next point
				await ServerPlayoutAPI.setNextPartInner(cache, newNextPart?.part ?? null)
			}
		} else if (!nextPartInstance || nextPartInstance.orphaned === 'deleted') {
			// Don't have a nextPart or it has been deleted, so autoselect something
			const newNextPart = selectNextPart(
				playlist,
				currentPartInstance ?? null,
				nextPartInstance ?? null,
				allPartsAndSegments
			)
			await ServerPlayoutAPI.setNextPartInner(cache, newNextPart?.part ?? null)
		}
	}

	span?.end()
}
