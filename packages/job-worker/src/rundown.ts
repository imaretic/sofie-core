import { PartId, PartInstanceId, SegmentId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { DBPart } from '@sofie-automation/corelib/dist/dataModel/Part'
import { DBRundown } from '@sofie-automation/corelib/dist/dataModel/Rundown'
import { DBRundownPlaylist } from '@sofie-automation/corelib/dist/dataModel/RundownPlaylist'
import { normalizeArrayToMap } from '@sofie-automation/corelib/dist/lib'
import { unprotectString } from '@sofie-automation/corelib/dist/protectedString'
import { ReadonlyDeep } from 'type-fest'
import _ = require('underscore')
import { JobContext } from './jobs'
import { logger } from './logging'
import { CacheForPlayout } from './playout/cache'

/** Return true if the rundown is allowed to be moved out of that playlist */
export async function allowedToMoveRundownOutOfPlaylist(
	context: JobContext,
	playlist: ReadonlyDeep<DBRundownPlaylist>,
	rundown: ReadonlyDeep<Pick<DBRundown, '_id' | 'playlistId'>>
): Promise<boolean> {
	if (rundown.playlistId !== playlist._id)
		throw new Error(
			`Wrong playlist "${playlist._id}" provided for rundown "${rundown._id}" ("${rundown.playlistId}")`
		)

	const partInstanceIds = _.compact([playlist.currentPartInstanceId, playlist.nextPartInstanceId])
	if (!playlist.activationId || partInstanceIds.length === 0) return true

	const selectedPartInstancesInRundown = await context.directCollections.PartInstances.findFetch(
		{
			_id: { $in: partInstanceIds },
			rundownId: rundown._id,
		},
		{ projection: { _id: 1 } }
	)

	return selectedPartInstancesInRundown.length === 0
}

export type ChangedSegmentsRankInfo = Array<{
	segmentId: SegmentId
	oldPartIdsAndRanks: Array<{ id: PartId; rank: number }> | null // Null if the Parts havent changed, and so can be loaded locally
}>

/**
 * Update the ranks of all PartInstances in the given segments.
 * Syncs the ranks from matching Parts to PartInstances.
 * Orphaned PartInstances get ranks interpolated based on what they were ranked between before the ingest update
 */
export function updatePartInstanceRanks(cache: CacheForPlayout, changedSegments: ChangedSegmentsRankInfo): void {
	const groupedPartInstances = _.groupBy(
		cache.PartInstances.findFetch({
			reset: { $ne: true },
			segmentId: { $in: changedSegments.map((s) => s.segmentId) },
		}),
		(p) => unprotectString(p.segmentId)
	)
	const groupedNewParts = _.groupBy(
		cache.Parts.findFetch({
			segmentId: { $in: changedSegments.map((s) => s.segmentId) },
		}),
		(p) => unprotectString(p.segmentId)
	)

	let updatedParts = 0
	for (const { segmentId, oldPartIdsAndRanks: oldPartIdsAndRanks0 } of changedSegments) {
		const newParts = groupedNewParts[unprotectString(segmentId)] || []
		const segmentPartInstances = _.sortBy(
			groupedPartInstances[unprotectString(segmentId)] || [],
			(p) => p.part._rank
		)

		// Ensure the PartInstance ranks are synced with their Parts
		const newPartsMap = normalizeArrayToMap(newParts, '_id')
		for (const partInstance of segmentPartInstances) {
			const part = newPartsMap.get(partInstance.part._id)
			if (part) {
				// We have a part and instance, so make sure the part isn't orphaned and sync the rank
				cache.PartInstances.update(partInstance._id, {
					$set: {
						'part._rank': part._rank,
					},
					$unset: {
						orphaned: 1,
					},
				})

				// Update local copy
				delete partInstance.orphaned
				partInstance.part._rank = part._rank
			} else if (!partInstance.orphaned) {
				cache.PartInstances.update(partInstance._id, {
					$set: {
						orphaned: 'deleted',
					},
				})
				partInstance.orphaned = 'deleted'
			}
		}

		const orphanedPartInstances = segmentPartInstances
			.map((p) => ({ rank: p.part._rank, orphaned: p.orphaned, instanceId: p._id, id: p.part._id }))
			.filter((p) => p.orphaned)

		if (orphanedPartInstances.length === 0) {
			// No orphans to position
			continue
		}

		logger.debug(
			`updatePartInstanceRanks: ${segmentPartInstances.length} partInstances with ${orphanedPartInstances.length} orphans in segment "${segmentId}"`
		)

		// If we have no instances, or no parts to base it on, then we can't do anything
		if (newParts.length === 0) {
			// position them all 0..n
			let i = 0
			for (const partInfo of orphanedPartInstances) {
				cache.PartInstances.update(partInfo.instanceId, { $set: { 'part._rank': i++ } })
			}
			continue
		}

		const oldPartIdsAndRanks = oldPartIdsAndRanks0 ?? newParts.map((p) => ({ id: p._id, rank: p._rank }))

		const preservedPreviousParts = oldPartIdsAndRanks.filter((p) => newPartsMap.has(p.id))

		if (preservedPreviousParts.length === 0) {
			// position them all before the first
			const firstPartRank = newParts.length > 0 ? (_.min(newParts, (p) => p._rank) as DBPart)._rank : 0
			let i = firstPartRank - orphanedPartInstances.length
			for (const partInfo of orphanedPartInstances) {
				cache.PartInstances.update(partInfo.instanceId, { $set: { 'part._rank': i++ } })
			}
		} else {
			// they need interleaving

			// compile the old order, and get a list of the ones that still remain in the new state
			const allParts = new Map<PartId, { rank: number; id: PartId; instanceId?: PartInstanceId }>()
			for (const oldPart of oldPartIdsAndRanks) allParts.set(oldPart.id, oldPart)
			for (const orphanedPart of orphanedPartInstances) allParts.set(orphanedPart.id, orphanedPart)

			// Now go through and update their ranks
			const remainingPreviousParts = _.sortBy(Array.from(allParts.values()), (p) => p.rank).filter(
				(p) => p.instanceId || newPartsMap.has(p.id)
			)

			for (let i = -1; i < remainingPreviousParts.length - 1; ) {
				// Find the range to process this iteration
				const beforePartIndex = i
				const afterPartIndex = remainingPreviousParts.findIndex((p, o) => o > i && !p.instanceId)

				if (afterPartIndex === beforePartIndex + 1) {
					// no dynamic parts in between
					i++
					continue
				} else if (afterPartIndex === -1) {
					// We will reach the end, so make sure we stop
					i = remainingPreviousParts.length
				} else {
					// next iteration should look from the next fixed point
					i = afterPartIndex
				}

				const firstDynamicIndex = beforePartIndex + 1
				const lastDynamicIndex = afterPartIndex === -1 ? remainingPreviousParts.length - 1 : afterPartIndex - 1

				// Calculate the rank change per part
				const dynamicPartCount = lastDynamicIndex - firstDynamicIndex + 1
				const basePartRank =
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					beforePartIndex === -1 ? -1 : newPartsMap.get(remainingPreviousParts[beforePartIndex].id)?._rank! // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
				const afterPartRank =
					afterPartIndex === -1
						? basePartRank + 1
						: // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						  newPartsMap.get(remainingPreviousParts[afterPartIndex].id)?._rank! // eslint-disable-line @typescript-eslint/no-non-null-asserted-optional-chain
				const delta = (afterPartRank - basePartRank) / (dynamicPartCount + 1)

				let prevRank = basePartRank
				for (let o = firstDynamicIndex; o <= lastDynamicIndex; o++) {
					const newRank = (prevRank = prevRank + delta)

					const orphanedPart = remainingPreviousParts[o]
					if (orphanedPart.instanceId && orphanedPart.rank !== newRank) {
						cache.PartInstances.update(orphanedPart.instanceId, { $set: { 'part._rank': newRank } })
						updatedParts++
					}
				}
			}
		}
	}
	logger.debug(`updatePartRanks: ${updatedParts} PartInstances updated`)
}