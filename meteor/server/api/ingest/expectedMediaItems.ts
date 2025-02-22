import { check, Match } from '../../../lib/check'
import { Meteor } from 'meteor/meteor'
import {
	ExpectedMediaItems,
	ExpectedMediaItem,
	ExpectedMediaItemId,
	ExpectedMediaItemBucketPiece,
	ExpectedMediaItemBucketAction,
	ExpectedMediaItemBase,
	ExpectedMediaItemRundown,
} from '../../../lib/collections/ExpectedMediaItems'
import { RundownId } from '../../../lib/collections/Rundowns'
import { Piece, PieceId } from '../../../lib/collections/Pieces'
import { AdLibPiece } from '../../../lib/collections/AdLibPieces'
import { getCurrentTime, getHash, protectString, Subtract, ProtectedString, isProtectedString } from '../../../lib/lib'
import { BucketAdLib, BucketAdLibs } from '../../../lib/collections/BucketAdlibs'
import { StudioId } from '../../../lib/collections/Studios'
import { AdLibAction, AdLibActionId } from '../../../lib/collections/AdLibActions'
import {
	IBlueprintActionManifestDisplayContent,
	SomeContent,
	VTContent,
} from '@sofie-automation/blueprints-integration'
import { BucketAdLibAction, BucketAdLibActions } from '../../../lib/collections/BucketAdlibActions'
import { CacheForIngest } from './cache'
import { saveIntoCache } from '../../cache/lib'
import { saveIntoDb } from '../../lib/database'
import { interpollateTranslation, translateMessage } from '../../../lib/api/TranslatableMessage'

export enum PieceType {
	PIECE = 'piece',
	ADLIB = 'adlib',
	ACTION = 'action',
}

// TODO-PartInstance generate these for when the part has no need, but the instance still references something

function generateExpectedMediaItems<T extends ExpectedMediaItemBase>(
	sourceId: ProtectedString<any>,
	commonProps: Subtract<T, ExpectedMediaItemBase>,
	studioId: StudioId,
	label: string,
	content: Partial<SomeContent> | undefined,
	pieceType: string
): T[] {
	const result: T[] = []

	const pieceContent = content as Partial<VTContent> | undefined
	if (pieceContent && pieceContent.fileName && pieceContent.path && pieceContent.mediaFlowIds) {
		for (const flow of pieceContent.mediaFlowIds) {
			const id = protectString<ExpectedMediaItemId>(
				getHash(pieceType + '_' + sourceId + '_' + JSON.stringify(commonProps) + '_' + flow)
			)
			const baseObj: ExpectedMediaItemBase = {
				_id: id,
				studioId: studioId,
				label: label,
				disabled: false,
				lastSeen: getCurrentTime(),
				mediaFlowId: flow,
				path: pieceContent.fileName,
				url: pieceContent.path,
			}
			result.push({
				...commonProps,
				...baseObj,
			} as T)
		}
	}

	return result
}

function generateExpectedMediaItemsFull(
	studioId: StudioId,
	rundownId: RundownId,
	pieces: Piece[],
	adlibs: AdLibPiece[],
	actions: AdLibAction[]
): ExpectedMediaItem[] {
	const eMIs: ExpectedMediaItem[] = []

	pieces.forEach((doc) =>
		eMIs.push(
			...generateExpectedMediaItems<ExpectedMediaItemRundown>(
				doc._id,
				{
					partId: doc.startPartId,
					rundownId: doc.startRundownId,
				},
				studioId,
				doc.name,
				doc.content,
				PieceType.PIECE
			)
		)
	)
	adlibs.forEach((doc) =>
		eMIs.push(
			...generateExpectedMediaItems<ExpectedMediaItemRundown>(
				doc._id,
				{
					partId: doc.partId,
					rundownId: rundownId,
				},
				studioId,
				doc.name,
				doc.content,
				PieceType.ADLIB
			)
		)
	)
	actions.forEach((doc) =>
		eMIs.push(
			...generateExpectedMediaItems<ExpectedMediaItemRundown>(
				doc._id,
				{
					partId: doc.partId,
					rundownId: rundownId,
				},
				studioId,
				translateMessage(doc.display.label, interpollateTranslation),
				(doc.display as IBlueprintActionManifestDisplayContent | undefined)?.content,
				PieceType.ACTION
			)
		)
	)

	return eMIs
}

export async function cleanUpExpectedMediaItemForBucketAdLibPiece(adLibIds: PieceId[]): Promise<void> {
	check(adLibIds, [String])

	await ExpectedMediaItems.removeAsync({
		bucketAdLibPieceId: {
			$in: adLibIds,
		},
	})
	// disabled to reduce spam:
	// logger.info(`Removed ${removedItems} expected media items for deleted bucket adLib items`)
}

export async function cleanUpExpectedMediaItemForBucketAdLibActions(actionIds: AdLibActionId[]): Promise<void> {
	check(actionIds, [String])

	await ExpectedMediaItems.removeAsync({
		bucketAdLibActionId: {
			$in: actionIds,
		},
	})
	// disabled to reduce spam:
	// logger.info(`Removed ${removedItems} expected media items for deleted bucket adLib actions`)
}

export async function updateExpectedMediaItemForBucketAdLibPiece(adLibOrId: PieceId | BucketAdLib): Promise<void> {
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
		await cleanUpExpectedMediaItemForBucketAdLibPiece([adLibId])
		throw new Meteor.Error(404, `Bucket AdLib "${adLibId}" not found!`)
	}

	const result = generateExpectedMediaItems<ExpectedMediaItemBucketPiece>(
		adLib._id,
		{
			bucketId: adLib.bucketId,
			bucketAdLibPieceId: adLib._id,
		},
		adLib.studioId,
		adLib.name,
		adLib.content,
		PieceType.ADLIB
	)

	await saveIntoDb(
		ExpectedMediaItems,
		{
			bucketAdLibPieceId: adLibId,
		},
		result
	)
}

export async function updateExpectedMediaItemForBucketAdLibAction(
	actionOrId: AdLibActionId | BucketAdLibAction
): Promise<void> {
	check(actionOrId, Match.OneOf(String, Object))

	let action: BucketAdLibAction | undefined
	let actionId: AdLibActionId

	if (isProtectedString(actionOrId)) {
		actionId = actionOrId
		action = await BucketAdLibActions.findOneAsync(actionId)
	} else {
		action = actionOrId
		actionId = action._id
	}

	if (!action) {
		await cleanUpExpectedMediaItemForBucketAdLibActions([actionId])
		throw new Meteor.Error(404, `Bucket Action "${actionId}" not found!`)
	}

	const result = generateExpectedMediaItems<ExpectedMediaItemBucketAction>(
		action._id,
		{
			bucketId: action.bucketId,
			bucketAdLibActionId: action._id,
		},
		action.studioId,
		translateMessage(action.display.label, interpollateTranslation),
		(action.display as IBlueprintActionManifestDisplayContent | undefined)?.content,
		PieceType.ADLIB
	)

	await saveIntoDb(
		ExpectedMediaItems,
		{
			bucketAdLibActionId: actionId,
		},
		result
	)
}
/** @deprecated */
export function updateExpectedMediaItemsOnRundown(cache: CacheForIngest): void {
	const pieces = cache.Pieces.findFetch({})
	const adlibs = cache.AdLibPieces.findFetch({})
	const actions = cache.AdLibActions.findFetch({})

	const eMIs = generateExpectedMediaItemsFull(cache.Studio.doc._id, cache.RundownId, pieces, adlibs, actions)
	saveIntoCache<ExpectedMediaItem, ExpectedMediaItem>(cache.ExpectedMediaItems, {}, eMIs)
}
