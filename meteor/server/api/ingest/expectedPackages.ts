import { check, Match } from '../../../lib/check'
import { RundownId } from '../../../lib/collections/Rundowns'
import { AdLibPiece } from '../../../lib/collections/AdLibPieces'
import { AdLibAction, AdLibActionId } from '../../../lib/collections/AdLibActions'
import { updateExpectedMediaItemsOnRundown } from './expectedMediaItems'
import {
	ExpectedPackageDB,
	ExpectedPackageDBBase,
	ExpectedPackageDBFromAdLibAction,
	ExpectedPackageDBFromBaselineAdLibAction,
	ExpectedPackageDBFromBaselineAdLibPiece,
	ExpectedPackageDBFromBucketAdLib,
	ExpectedPackageDBFromBucketAdLibAction,
	ExpectedPackageDBFromPiece,
	ExpectedPackageDBFromRundownBaselineObjects,
	ExpectedPackageDBFromStudioBaselineObjects,
	ExpectedPackageDBType,
	ExpectedPackages,
	getContentVersionHash,
	getExpectedPackageId,
} from '../../../lib/collections/ExpectedPackages'
import { Studio, StudioId, Studios } from '../../../lib/collections/Studios'
import { BlueprintResultBaseline, ExpectedPackage } from '@sofie-automation/blueprints-integration'
import { Piece, PieceId } from '../../../lib/collections/Pieces'
import { BucketAdLibAction, BucketAdLibActionId, BucketAdLibActions } from '../../../lib/collections/BucketAdlibActions'
import { Meteor } from 'meteor/meteor'
import { BucketAdLib, BucketAdLibId, BucketAdLibs } from '../../../lib/collections/BucketAdlibs'
import {
	RundownBaselineAdLibAction,
	RundownBaselineAdLibActionId,
} from '../../../lib/collections/RundownBaselineAdLibActions'
import {
	updateBaselineExpectedPlayoutItemsOnRundown,
	updateBaselineExpectedPlayoutItemsOnStudio,
	updateExpectedPlayoutItemsOnRundown,
} from './expectedPlayoutItems'
import { PartInstance } from '../../../lib/collections/PartInstances'
import { PieceInstances } from '../../../lib/collections/PieceInstances'
import { CacheForIngest } from './cache'
import { saveIntoDb } from '../../lib/database'
import { saveIntoCache } from '../../cache/lib'
import { ReadonlyDeep } from 'type-fest'
import { CacheForPlayout } from '../playout/cache'
import { CacheForStudio } from '../studio/cache'
import { SegmentId } from '../../../lib/collections/Segments'
import { PartId } from '../../../lib/collections/Parts'
import { RundownBaselineAdLibItem } from '../../../lib/collections/RundownBaselineAdLibPieces'
import { StudioLight } from '../../../lib/collections/optimizations'
import { isProtectedString } from '../../../lib/lib'

export function updateExpectedPackagesOnRundown(cache: CacheForIngest): void {
	// @todo: this call is for backwards compatibility and soon to be removed
	updateExpectedMediaItemsOnRundown(cache)
	updateExpectedPlayoutItemsOnRundown(cache)

	const studio = cache.Studio.doc

	const pieces = cache.Pieces.findFetch({})
	const adlibs = cache.AdLibPieces.findFetch({})
	const actions = cache.AdLibActions.findFetch({})

	const partToSegmentIdMap = new Map<PartId, SegmentId>()
	for (const part of cache.Parts.findFetch({})) {
		partToSegmentIdMap.set(part._id, part.segmentId)
	}

	// todo: keep expectedPackage of the currently playing partInstance

	const expectedPackages: ExpectedPackageDB[] = [
		...generateExpectedPackagesForPiece(
			studio,
			cache.RundownId,
			partToSegmentIdMap,
			pieces,
			ExpectedPackageDBType.PIECE
		),
		...generateExpectedPackagesForPiece(
			studio,
			cache.RundownId,
			partToSegmentIdMap,
			adlibs,
			ExpectedPackageDBType.ADLIB_PIECE
		),
		...generateExpectedPackagesForAdlibAction(studio, cache.RundownId, partToSegmentIdMap, actions),
	]

	// RUNDOWN_BASELINE_OBJECTS follow their own flow
	const preserveTypesDuringSave = [ExpectedPackageDBType.RUNDOWN_BASELINE_OBJECTS]

	// Only regenerate the baseline types if they are already loaded into memory
	// If the cache isn't already loaded, then we haven't made any changes to the baseline adlibs
	// This means we can skip regenerating them as it is guaranteed there will be no changes
	const baselineAdlibPieceCache = cache.RundownBaselineAdLibPieces.getIfLoaded()
	if (baselineAdlibPieceCache) {
		expectedPackages.push(
			...generateExpectedPackagesForBaselineAdlibPiece(
				studio,
				cache.RundownId,
				baselineAdlibPieceCache.findFetch()
			)
		)
	} else {
		// We haven't regenerated anything, so preserve the values in the save
		preserveTypesDuringSave.push(ExpectedPackageDBType.BASELINE_ADLIB_PIECE)
	}
	const baselineAdlibActionCache = cache.RundownBaselineAdLibActions.getIfLoaded()
	if (baselineAdlibActionCache) {
		expectedPackages.push(
			...generateExpectedPackagesForBaselineAdlibAction(
				studio,
				cache.RundownId,
				baselineAdlibActionCache.findFetch()
			)
		)
	} else {
		// We haven't regenerated anything, so preserve the values in the save
		preserveTypesDuringSave.push(ExpectedPackageDBType.BASELINE_ADLIB_ACTION)
	}

	saveIntoCache<ExpectedPackageDB, ExpectedPackageDB>(
		cache.ExpectedPackages,
		{
			fromPieceType: { $nin: preserveTypesDuringSave as any },
		},
		expectedPackages,
		{
			beforeUpdate: (expPackage: ExpectedPackageDB, pre?: ExpectedPackageDB) => {
				if (pre) expPackage.created = pre.created // Retain the created property
				return expPackage
			},
		}
	)
}
export function generateExpectedPackagesForPartInstance(
	studio: StudioLight,
	rundownId: RundownId,
	partInstance: PartInstance
) {
	const packages: ExpectedPackageDBFromPiece[] = []

	const pieceInstances = PieceInstances.find({
		rundownId: rundownId,
		partInstanceId: partInstance._id,
	}).fetch()

	for (const pieceInstance of pieceInstances) {
		if (pieceInstance.piece.expectedPackages) {
			const bases = generateExpectedPackageBases(
				studio,
				pieceInstance.piece._id,
				pieceInstance.piece.expectedPackages
			)
			for (const base of bases) {
				packages.push({
					...base,
					rundownId,
					segmentId: partInstance.part.segmentId,
					pieceId: pieceInstance.piece._id,
					fromPieceType: ExpectedPackageDBType.PIECE,
				})
			}
		}
	}
	return packages
}
function generateExpectedPackagesForPiece(
	studio: ReadonlyDeep<Studio>,
	rundownId: RundownId,
	partToSegmentIdMap: Map<PartId, SegmentId>,
	pieces: (Piece | AdLibPiece)[],
	type: ExpectedPackageDBType.PIECE | ExpectedPackageDBType.ADLIB_PIECE
) {
	const packages: ExpectedPackageDBFromPiece[] = []
	for (const piece of pieces) {
		const partId = 'startPartId' in piece ? piece.startPartId : piece.partId
		if (piece.expectedPackages && partId) {
			const segmentId = partToSegmentIdMap.get(partId)
			if (segmentId) {
				const bases = generateExpectedPackageBases(studio, piece._id, piece.expectedPackages)
				for (const base of bases) {
					packages.push({
						...base,
						rundownId,
						segmentId,
						pieceId: piece._id,
						fromPieceType: type,
					})
				}
			}
		}
	}
	return packages
}
function generateExpectedPackagesForBaselineAdlibPiece(
	studio: ReadonlyDeep<Studio>,
	rundownId: RundownId,
	pieces: RundownBaselineAdLibItem[]
) {
	const packages: ExpectedPackageDBFromBaselineAdLibPiece[] = []
	for (const piece of pieces) {
		if (piece.expectedPackages) {
			const bases = generateExpectedPackageBases(studio, piece._id, piece.expectedPackages)
			for (const base of bases) {
				packages.push({
					...base,
					rundownId,
					pieceId: piece._id,
					fromPieceType: ExpectedPackageDBType.BASELINE_ADLIB_PIECE,
				})
			}
		}
	}
	return packages
}
function generateExpectedPackagesForAdlibAction(
	studio: ReadonlyDeep<Studio>,
	rundownId: RundownId,
	partToSegmentIdMap: Map<PartId, SegmentId>,
	actions: AdLibAction[]
) {
	const packages: ExpectedPackageDBFromAdLibAction[] = []
	for (const action of actions) {
		if (action.expectedPackages) {
			const segmentId = partToSegmentIdMap.get(action.partId)
			if (segmentId) {
				const bases = generateExpectedPackageBases(studio, action._id, action.expectedPackages)
				for (const base of bases) {
					packages.push({
						...base,
						rundownId,
						segmentId,
						pieceId: action._id,
						fromPieceType: ExpectedPackageDBType.ADLIB_ACTION,
					})
				}
			}
		}
	}
	return packages
}
function generateExpectedPackagesForBaselineAdlibAction(
	studio: ReadonlyDeep<Studio>,
	rundownId: RundownId,
	actions: RundownBaselineAdLibAction[]
) {
	const packages: ExpectedPackageDBFromBaselineAdLibAction[] = []
	for (const action of actions) {
		if (action.expectedPackages) {
			const bases = generateExpectedPackageBases(studio, action._id, action.expectedPackages)
			for (const base of bases) {
				packages.push({
					...base,
					rundownId,
					pieceId: action._id,
					fromPieceType: ExpectedPackageDBType.BASELINE_ADLIB_ACTION,
				})
			}
		}
	}
	return packages
}
function generateExpectedPackagesForBucketAdlib(studio: Studio, adlibs: BucketAdLib[]) {
	const packages: ExpectedPackageDBFromBucketAdLib[] = []
	for (const adlib of adlibs) {
		if (adlib.expectedPackages) {
			const bases = generateExpectedPackageBases(studio, adlib._id, adlib.expectedPackages)
			for (const base of bases) {
				packages.push({
					...base,
					bucketId: adlib.bucketId,
					pieceId: adlib._id,
					fromPieceType: ExpectedPackageDBType.BUCKET_ADLIB,
				})
			}
		}
	}
	return packages
}
function generateExpectedPackagesForBucketAdlibAction(studio: Studio, adlibActions: BucketAdLibAction[]) {
	const packages: ExpectedPackageDBFromBucketAdLibAction[] = []
	for (const action of adlibActions) {
		if (action.expectedPackages) {
			const bases = generateExpectedPackageBases(studio, action._id, action.expectedPackages)
			for (const base of bases) {
				packages.push({
					...base,
					bucketId: action.bucketId,
					pieceId: action._id,
					fromPieceType: ExpectedPackageDBType.BUCKET_ADLIB_ACTION,
				})
			}
		}
	}
	return packages
}
function generateExpectedPackageBases(
	studio: ReadonlyDeep<StudioLight>,
	ownerId:
		| PieceId
		| AdLibActionId
		| RundownBaselineAdLibActionId
		| BucketAdLibId
		| BucketAdLibActionId
		| RundownId
		| StudioId,
	expectedPackages: ExpectedPackage.Any[]
) {
	const bases: Omit<ExpectedPackageDBBase, 'pieceId' | 'fromPieceType'>[] = []

	for (let i = 0; i < expectedPackages.length; i++) {
		const expectedPackage = expectedPackages[i]
		const id = expectedPackage._id || '__unnamed' + i

		bases.push({
			...expectedPackage,
			_id: getExpectedPackageId(ownerId, id),
			blueprintPackageId: id,
			contentVersionHash: getContentVersionHash(expectedPackage),
			studioId: studio._id,
			created: Date.now(),
		})
	}
	return bases
}

export async function updateExpectedPackagesForBucketAdLib(adLibOrId: BucketAdLibId | BucketAdLib): Promise<void> {
	check(adLibOrId, Match.OneOf(String, Object))

	let adLib: BucketAdLib | undefined
	let adLibId: PieceId

	if (isProtectedString(adLibOrId)) {
		adLibId = adLibOrId
		adLib = await BucketAdLibs.findOneAsync(adLibId)
	} else {
		adLib = adLibOrId
		adLibId = adLib._id
	}

	if (!adLib) {
		await cleanUpExpectedPackagesForBucketAdLibs([adLibId])
		throw new Meteor.Error(404, `Bucket Adlib "${adLibId}" not found!`)
	}
	const studio = await Studios.findOneAsync(adLib.studioId)
	if (!studio) throw new Meteor.Error(404, `Studio "${adLib.studioId}" not found!`)

	const packages = generateExpectedPackagesForBucketAdlib(studio, [adLib])

	await saveIntoDb(ExpectedPackages, { pieceId: adLibId }, packages)
}
export async function updateExpectedPackagesForBucketAdLibAction(
	actionOrId: BucketAdLibActionId | BucketAdLibAction
): Promise<void> {
	check(actionOrId, Match.OneOf(String, Object))

	let action: BucketAdLibAction | undefined
	let actionId: BucketAdLibActionId

	if (isProtectedString(actionOrId)) {
		actionId = actionOrId
		action = await BucketAdLibActions.findOneAsync(actionId)
	} else {
		action = actionOrId
		actionId = action._id
	}

	if (!action) {
		await cleanUpExpectedPackagesForBucketAdLibsActions([actionId])
		throw new Meteor.Error(404, `Bucket Action "${actionId}" not found!`)
	}
	const studio = await Studios.findOneAsync(action.studioId)
	if (!studio) throw new Meteor.Error(404, `Studio "${action.studioId}" not found!`)

	const packages = generateExpectedPackagesForBucketAdlibAction(studio, [action])

	await saveIntoDb(ExpectedPackages, { pieceId: actionId }, packages)
}
export async function cleanUpExpectedPackagesForBucketAdLibs(adLibIds: PieceId[]): Promise<void> {
	check(adLibIds, [String])

	await ExpectedPackages.removeAsync({
		pieceId: {
			$in: adLibIds,
		},
	})
}
export async function cleanUpExpectedPackagesForBucketAdLibsActions(adLibIds: AdLibActionId[]): Promise<void> {
	check(adLibIds, [String])

	await ExpectedPackages.removeAsync({
		pieceId: {
			$in: adLibIds,
		},
	})
}

export function updateBaselineExpectedPackagesOnRundown(
	cache: CacheForIngest,
	baseline: BlueprintResultBaseline
): void {
	// @todo: this call is for backwards compatibility and soon to be removed
	updateBaselineExpectedPlayoutItemsOnRundown(cache, baseline.expectedPlayoutItems)

	// Fill in ids of unnamed expectedPackages
	setDefaultIdOnExpectedPackages(baseline.expectedPackages)

	const bases = generateExpectedPackageBases(cache.Studio.doc, cache.RundownId, baseline.expectedPackages ?? [])
	saveIntoCache<ExpectedPackageDB, ExpectedPackageDB>(
		cache.ExpectedPackages,
		{
			fromPieceType: ExpectedPackageDBType.RUNDOWN_BASELINE_OBJECTS,
		},
		bases.map((item): ExpectedPackageDBFromRundownBaselineObjects => {
			return {
				...item,
				fromPieceType: ExpectedPackageDBType.RUNDOWN_BASELINE_OBJECTS,
				rundownId: cache.RundownId,
				pieceId: null,
			}
		}),
		{
			beforeUpdate: (expPackage: ExpectedPackageDB, pre?: ExpectedPackageDB) => {
				if (pre) expPackage.created = pre.created // Retain the created property
				return expPackage
			},
		}
	)
}

export function updateBaselineExpectedPackagesOnStudio(
	cache: CacheForStudio | CacheForPlayout,
	baseline: BlueprintResultBaseline
): void {
	// @todo: this call is for backwards compatibility and soon to be removed
	updateBaselineExpectedPlayoutItemsOnStudio(cache, baseline.expectedPlayoutItems)

	// Fill in ids of unnamed expectedPackages
	setDefaultIdOnExpectedPackages(baseline.expectedPackages)

	const bases = generateExpectedPackageBases(cache.Studio.doc, cache.Studio.doc._id, baseline.expectedPackages ?? [])
	cache.deferAfterSave(async () => {
		await saveIntoDb<ExpectedPackageDB, ExpectedPackageDB>(
			ExpectedPackages,
			{
				studioId: cache.Studio.doc._id,
				fromPieceType: ExpectedPackageDBType.STUDIO_BASELINE_OBJECTS,
			},
			bases.map((item): ExpectedPackageDBFromStudioBaselineObjects => {
				return {
					...item,
					fromPieceType: ExpectedPackageDBType.STUDIO_BASELINE_OBJECTS,
					pieceId: null,
				}
			})
		)
	})
}

export function setDefaultIdOnExpectedPackages(expectedPackages: ExpectedPackage.Any[] | undefined): void {
	// Fill in ids of unnamed expectedPackage
	if (expectedPackages) {
		for (let i = 0; i < expectedPackages.length; i++) {
			const expectedPackage = expectedPackages[i]
			if (!expectedPackage._id) {
				expectedPackage._id = `__index${i}`
			}
		}
	}
}
