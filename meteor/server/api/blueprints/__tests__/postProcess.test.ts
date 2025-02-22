import * as _ from 'underscore'

import { setupDefaultStudioEnvironment, DefaultEnvironment } from '../../../../__mocks__/helpers/database'
import { literal, protectString, unprotectString } from '../../../../lib/lib'
import {
	postProcessStudioBaselineObjects,
	postProcessRundownBaselineItems,
	postProcessAdLibPieces,
	postProcessPieces,
} from '../postProcess'
import {
	IBlueprintPiece,
	IBlueprintAdLibPiece,
	TimelineObjectCoreExt,
	TSR,
	PieceLifespan,
} from '@sofie-automation/blueprints-integration'
import { Piece } from '../../../../lib/collections/Pieces'
import { TimelineObjGeneric, TimelineObjType } from '../../../../lib/collections/Timeline'
import { AdLibPiece } from '../../../../lib/collections/AdLibPieces'

// Setup the mocks
import * as hashlib from '../../../../lib/hash'
const getHashOrig = hashlib.getHash
const getHashMock = jest.spyOn(hashlib, 'getHash')

describe('Test blueprint post-process', () => {
	let env: DefaultEnvironment
	beforeAll(async () => {
		env = await setupDefaultStudioEnvironment()
	})
	afterEach(() => {
		getHashMock.mockReset()
		getHashMock.mockImplementation(getHashOrig)
	})

	function getStudio() {
		return env.studio
	}

	function ensureAllKeysDefined<T>(template: T, objects: T[]) {
		const errs: string[] = []
		_.each(objects, (obj, i) => {
			for (const key of _.keys(template)) {
				const key2 = key as keyof T
				if (obj[key2] === undefined) {
					errs.push(`${i}.${key2}`)
				}
			}
		})

		expect(errs).toEqual([])
	}

	describe('postProcessStudioBaselineObjects', () => {
		test('no objects', () => {
			const studio = getStudio()

			// Ensure that an empty array works ok
			const res = postProcessStudioBaselineObjects(studio, [])
			expect(res).toHaveLength(0)
		})

		test('some no ids', () => {
			const studio = getStudio()

			const rawObjects = literal<TSR.TSRTimelineObjBase[]>([
				{
					id: 'testObj',
					enable: {},
					layer: 'one',
					content: {
						deviceType: TSR.DeviceType.ABSTRACT,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'two',
					content: {
						deviceType: TSR.DeviceType.CASPARCG,
					},
				},
				{
					id: 'finalObj',
					enable: {},
					layer: 'three',
					content: {
						deviceType: TSR.DeviceType.ATEM,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'four',
					content: {
						deviceType: TSR.DeviceType.HYPERDECK,
					},
				},
			])

			// TODO - mock getHash?

			const res = postProcessStudioBaselineObjects(studio, _.clone(rawObjects))

			// Nothing should have been overridden (yet)
			_.each(rawObjects, (obj) => {
				// 'Hack' off the invalid fields to make the MatchObject pass
				// @ts-expect-error
				if (obj.id === '') delete obj.id
			})
			expect(res).toMatchObject(rawObjects)

			// Certain fields should be defined by simple rules
			expect(_.filter(res, (r) => r.id === '')).toHaveLength(0)
			expect(_.filter(res, (r) => r.objectType !== 'rundown')).toHaveLength(0)

			// Ensure no ids were duplicates
			const ids = _.map(res, (obj) => obj.id)
			expect(ids).toHaveLength(_.uniq(ids).length)
		})
		test('duplicate ids', () => {
			const studio = getStudio()
			const blueprintId = protectString(unprotectString(studio.blueprintId)) // the unit could modify the value, so make a literal copy

			const rawObjects = literal<TSR.TSRTimelineObjBase[]>([
				{
					id: 'testObj',
					enable: {},
					layer: 'one',
					content: {
						deviceType: TSR.DeviceType.ABSTRACT,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'two',
					content: {
						deviceType: TSR.DeviceType.CASPARCG,
					},
				},
				{
					id: 'testObj',
					enable: {},
					layer: 'three',
					content: {
						deviceType: TSR.DeviceType.ATEM,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'four',
					content: {
						deviceType: TSR.DeviceType.HYPERDECK,
					},
				},
			])

			expect(() => postProcessStudioBaselineObjects(studio, _.clone(rawObjects))).toThrow(
				`[400] Error in blueprint "${blueprintId}": ids of timelineObjs must be unique! ("testObj")`
			)
		})
	})

	describe('postProcessRundownBaselineItems', () => {
		test('no objects', () => {
			// Ensure that an empty array works ok
			const res = postProcessRundownBaselineItems(protectString('some-blueprints'), [])
			expect(res).toHaveLength(0)
		})

		test('some no ids', () => {
			const rawObjects = literal<TSR.TSRTimelineObjBase[]>([
				{
					id: 'testObj',
					enable: {},
					layer: 'one',
					content: {
						deviceType: TSR.DeviceType.ABSTRACT,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'two',
					content: {
						deviceType: TSR.DeviceType.CASPARCG,
					},
				},
				{
					id: 'finalObj',
					enable: {},
					layer: 'three',
					content: {
						deviceType: TSR.DeviceType.ATEM,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'four',
					content: {
						deviceType: TSR.DeviceType.HYPERDECK,
					},
				},
			])

			// mock getHash, to track the returned ids
			const mockedIds = ['mocked1', 'mocked2']
			const expectedIds = _.compact(_.map(rawObjects, (obj) => obj.id)).concat(mockedIds)
			getHashMock.mockImplementation(() => mockedIds.shift() || '')

			const res = postProcessRundownBaselineItems(protectString('some-blueprints'), _.clone(rawObjects))

			// Nothing should have been overridden (yet)
			_.each(rawObjects, (obj) => {
				// 'Hack' off the invalid fields to make the MatchObject pass
				// @ts-expect-error
				if (obj.id === '') delete obj.id
			})
			expect(res).toMatchObject(rawObjects)

			// Certain fields should be defined by simple rules
			expect(_.filter(res, (r) => r.id === '')).toHaveLength(0)
			expect(_.filter(res, (r) => r.objectType !== 'rundown')).toHaveLength(0)

			// Ensure getHash was called as expected
			expect(getHashMock).toHaveBeenCalledTimes(2)
			expect(getHashMock).toHaveBeenNthCalledWith(1, 'baseline_1')
			expect(getHashMock).toHaveBeenNthCalledWith(2, 'baseline_3')

			// Ensure no ids were duplicates
			const ids = _.map(res, (obj) => obj.id).sort()
			expect(ids).toEqual(expectedIds.sort())

			// Ensure all required keys are defined
			const tmpObj = literal<TimelineObjGeneric>({
				id: '',
				layer: '',
				enable: {},
				content: {} as any,
				objectType: TimelineObjType.RUNDOWN,
			})
			ensureAllKeysDefined(tmpObj, res)
		})
		test('duplicate ids', () => {
			const rawObjects = literal<TSR.TSRTimelineObjBase[]>([
				{
					id: 'testObj',
					enable: {},
					layer: 'one',
					content: {
						deviceType: TSR.DeviceType.ABSTRACT,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'two',
					content: {
						deviceType: TSR.DeviceType.CASPARCG,
					},
				},
				{
					id: 'testObj',
					enable: {},
					layer: 'three',
					content: {
						deviceType: TSR.DeviceType.ATEM,
					},
				},
				{
					id: '',
					enable: {},
					layer: 'four',
					content: {
						deviceType: TSR.DeviceType.HYPERDECK,
					},
				},
			])

			const blueprintId = 'some-blueprints'
			expect(() => postProcessRundownBaselineItems(protectString(blueprintId), _.clone(rawObjects))).toThrow(
				`[400] Error in blueprint "${blueprintId}": ids of timelineObjs must be unique! ("testObj")`
			)
		})
	})

	describe('postProcessAdLibPieces', () => {
		test('no pieces', () => {
			const blueprintId = protectString('blueprint0')
			const rundownId = protectString('rundown1')

			// Ensure that an empty array works ok
			const res = postProcessAdLibPieces(blueprintId, rundownId, undefined, [])
			expect(res).toHaveLength(0)
		})

		test('various pieces', () => {
			const blueprintId = protectString('blueprint9')
			const rundownId = protectString('rundown1')

			const pieces = literal<IBlueprintAdLibPiece[]>([
				{
					_rank: 2,
					name: 'test',
					externalId: 'eid1',
					sourceLayerId: 'sl0',
					outputLayerId: 'ol0',
					content: {} as any,
					lifespan: PieceLifespan.WithinPart,
				},
				{
					_rank: 1,
					name: 'test2',
					externalId: 'eid2',
					sourceLayerId: 'sl0',
					outputLayerId: 'ol0',
					content: {
						timelineObjects: [],
					},
					lifespan: PieceLifespan.WithinPart,
				},
				{
					_rank: 9,
					name: 'test2',
					externalId: 'eid2',
					sourceLayerId: 'sl0',
					outputLayerId: 'ol0',
					content: {
						timelineObjects: [],
					},
					lifespan: PieceLifespan.WithinPart,
				},
			])

			// mock getHash, to track the returned ids
			const mockedIds = ['mocked1', 'mocked2', 'mocked3']
			const expectedIds = _.clone(mockedIds)
			getHashMock.mockImplementation(() => mockedIds.shift() || '')

			const res = postProcessAdLibPieces(blueprintId, rundownId, undefined, pieces)
			// expect(res).toHaveLength(3)
			expect(res).toMatchObject(pieces.map((p) => _.omit(p, '_id')))

			// Ensure all required keys are defined
			const tmpObj = literal<AdLibPiece>({
				_id: protectString(''),
				_rank: 0,
				name: '',
				externalId: '',
				sourceLayerId: '',
				outputLayerId: '',
				rundownId: protectString(''),
				status: 0,
				content: {
					timelineObjects: [],
				},
				lifespan: PieceLifespan.WithinPart,
			})
			ensureAllKeysDefined(tmpObj, res)

			// Ensure getHash was called as expected
			expect(getHashMock).toHaveBeenCalledTimes(3)
			expect(getHashMock).toHaveBeenNthCalledWith(1, 'rundown1_blueprint9_undefined_adlib_piece_sl0_eid1_0')
			expect(getHashMock).toHaveBeenNthCalledWith(2, 'rundown1_blueprint9_undefined_adlib_piece_sl0_eid2_0')
			expect(getHashMock).toHaveBeenNthCalledWith(3, 'rundown1_blueprint9_undefined_adlib_piece_sl0_eid2_1')

			// Ensure no ids were duplicates
			const ids = _.map(res, (obj) => obj._id).sort()
			expect(ids).toEqual(expectedIds.sort())
		})
		test('piece with content', () => {
			const blueprintId = protectString('blueprint0')
			const rundownId = protectString('rundown1')

			const piece = literal<IBlueprintAdLibPiece>({
				_rank: 9,
				name: 'test2',
				externalId: 'eid2',
				sourceLayerId: 'sl0',
				outputLayerId: 'ol0',
				content: {
					timelineObjects: [
						literal<TimelineObjectCoreExt>({
							id: '',
							enable: {},
							layer: 'four',
							content: {
								deviceType: TSR.DeviceType.HYPERDECK,
							},
						}),
					],
				},
				lifespan: PieceLifespan.WithinPart,
			})

			const res = postProcessAdLibPieces(blueprintId, rundownId, undefined, [piece])
			expect(res).toHaveLength(1)
			expect(res).toMatchObject([piece])

			const tlObjId = res[0].content!.timelineObjects![0].id
			expect(tlObjId).not.toEqual('')
		})
	})

	describe('postProcessPieces', () => {
		test('no pieces', () => {
			// Ensure that an empty array works ok
			const res = postProcessPieces(
				[],
				protectString('blueprint9'),
				protectString('fakeRo'),
				protectString('segment5'),
				protectString('part8')
			)
			expect(res).toHaveLength(0)
		})

		test('various pieces', () => {
			const pieces = literal<IBlueprintPiece[]>([
				{
					name: 'test',
					externalId: 'eid1',
					enable: { start: 0 },
					sourceLayerId: 'sl0',
					outputLayerId: 'ol0',
					content: {} as any,
					lifespan: PieceLifespan.OutOnSegmentEnd,
				},
				{
					name: 'test2',
					externalId: 'eid2',
					enable: { start: 0 },
					sourceLayerId: 'sl0',
					outputLayerId: 'ol0',
					content: {
						timelineObjects: [],
					},
					lifespan: PieceLifespan.WithinPart,
				},
			])

			// mock getHash, to track the returned ids
			const mockedIds = ['mocked1', 'mocked2']
			const expectedIds = [...mockedIds]
			getHashMock.mockImplementation(() => mockedIds.shift() || '')

			const res = postProcessPieces(
				pieces,
				protectString('blueprint9'),
				protectString('fakeRo'),
				protectString('segment5'),
				protectString('part8')
			)
			expect(res).toMatchObject(pieces.map((p) => _.omit(p, '_id')))

			// Ensure all required keys are defined
			const tmpObj = literal<Piece>({
				_id: protectString(''),
				name: '',
				externalId: '',
				enable: { start: 0 },
				sourceLayerId: '',
				outputLayerId: '',
				startPartId: protectString(''),
				startSegmentId: protectString(''),
				startRundownId: protectString(''),
				status: 0,
				lifespan: PieceLifespan.WithinPart,
				content: {
					timelineObjects: [],
				},
				invalid: false,
			})
			ensureAllKeysDefined(tmpObj, res)

			// Ensure getHash was called as expected
			expect(getHashMock).toHaveBeenCalledTimes(2)
			expect(getHashMock).toHaveBeenNthCalledWith(1, 'fakeRo_blueprint9_part8_piece_sl0_eid1_0')
			expect(getHashMock).toHaveBeenNthCalledWith(2, 'fakeRo_blueprint9_part8_piece_sl0_eid2_0')

			// Ensure no ids were duplicates
			const ids = _.map(res, (obj) => obj._id).sort()
			expect(ids).toEqual(expectedIds.sort())
		})
		test('piece with content', () => {
			const piece = literal<IBlueprintPiece>({
				name: 'test2',
				externalId: 'eid2',
				enable: { start: 0 },
				sourceLayerId: 'sl0',
				outputLayerId: 'ol0',
				content: {
					timelineObjects: [
						literal<TimelineObjectCoreExt>({
							id: '',
							enable: {},
							layer: 'four',
							content: {
								deviceType: TSR.DeviceType.HYPERDECK,
							},
						}),
					],
				},
				lifespan: PieceLifespan.OutOnRundownEnd,
			})

			const res = postProcessPieces(
				[piece],
				protectString('blueprint9'),
				protectString('fakeRo'),
				protectString('segment8'),
				protectString('part6')
			)
			expect(res).toHaveLength(1)
			expect(res).toMatchObject([_.omit(piece, '_id')])

			const tlObjId = res[0].content!.timelineObjects![0].id
			expect(tlObjId).not.toEqual('')
		})
	})
})
