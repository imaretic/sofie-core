import * as _ from 'underscore'
import { makePromise, waitTime, MeteorWrapAsync } from '../../lib/lib'
import { registerClassToMeteorMethods } from '../methods'
import { MethodContextAPI, MethodContext } from '../../lib/api/methods'
import {
	SystemAPIMethods,
	CollectionCleanupResult,
	SystemAPI,
	BenchmarkResult,
	SystemBenchmarkResults,
} from '../../lib/api/system'
import { getAllIndexes } from '../../lib/database'
import { Meteor } from 'meteor/meteor'
import { IndexSpecification } from 'mongodb'
import { TransformedCollection } from '../../lib/typings/meteor'
import { logger } from '../logging'
import { SystemWriteAccess } from '../security/system'
import { check } from '../../lib/check'
import { createMongoCollection } from '../../lib/collections/lib'
import { getBundle as getTranslationBundleInner } from './translationsBundles'
import { TranslationsBundle, TranslationsBundleId } from '../../lib/collections/TranslationsBundles'
import { OrganizationContentWriteAccess } from '../security/organization'
import { ClientAPI } from '../../lib/api/client'
import { cleanupOldDataInner } from './cleanup'

function setupIndexes(removeOldIndexes: boolean = false): IndexSpecification[] {
	// Note: This function should NOT run on Meteor.startup, due to getCollectionIndexes failing if run before indexes have been created.
	const indexes = getAllIndexes()
	if (!Meteor.isServer) throw new Meteor.Error(500, `setupIndexes() can only be run server-side`)

	const removeIndexes: IndexSpecification[] = []
	_.each(indexes, (i, collectionName) => {
		const existingIndexes = getCollectionIndexes(i.collection)

		// Check if there are old indexes in the database that should be removed:
		_.each(existingIndexes, (existingIndex) => {
			// don't touch the users collection, as Metoer adds a few indexes of it's own
			if (collectionName === 'users') return
			if (!existingIndex.name) return // ?

			// Check if the existing index should be kept:
			const found = _.find([...i.indexes, { _id: 1 }], (newIndex) => {
				return _.isEqual(newIndex, existingIndex.key)
			})

			if (!found) {
				removeIndexes.push(existingIndex)
				// The existing index does not exist in our specified list of indexes, and should be removed.
				if (removeOldIndexes) {
					logger.info(`Removing index: ${JSON.stringify(existingIndex.key)}`)
					i.collection
						.rawCollection()
						.dropIndex(existingIndex.name)
						.catch((e) => {
							logger.warn(`Failed to drop index: ${JSON.stringify(existingIndex.key)}: ${e}`)
						})
				}
			}
		})

		// Ensure new indexes (add if not existing):
		_.each(i.indexes, (index) => {
			i.collection._ensureIndex(index)
		})
	})
	return removeIndexes
}
function ensureIndexes(): void {
	const indexes = getAllIndexes()
	if (!Meteor.isServer) throw new Meteor.Error(500, `setupIndexes() can only be run server-side`)

	// Ensure new indexes:
	_.each(indexes, (i) => {
		_.each(i.indexes, (index) => {
			i.collection._ensureIndex(index)
		})
	})
}

const getCollectionIndexes: (collection: TransformedCollection<any, any>) => IndexSpecification[] = MeteorWrapAsync(
	function getCollectionIndexes(collection: TransformedCollection<any, any>, callback: (err, result) => void) {
		collection.rawCollection().indexes(callback)
	}
)

Meteor.startup(() => {
	// Ensure indexes are created on startup:
	ensureIndexes()
})

export function cleanupIndexes(context: MethodContext, actuallyRemoveOldIndexes: boolean): IndexSpecification[] {
	check(actuallyRemoveOldIndexes, Boolean)
	SystemWriteAccess.coreSystem(context)

	return setupIndexes(actuallyRemoveOldIndexes)
}
export function cleanupOldData(
	context: MethodContext,
	actuallyRemoveOldData: boolean
): string | CollectionCleanupResult {
	check(actuallyRemoveOldData, Boolean)
	SystemWriteAccess.coreSystem(context)

	return cleanupOldDataInner(actuallyRemoveOldData)
}

let mongoTest: TransformedCollection<any, any> | undefined = undefined
/** Runs a set of system benchmarks, that are designed to test various aspects of the hardware-performance on the server */
async function doSystemBenchmarkInner() {
	if (!mongoTest) {
		mongoTest = createMongoCollection<any, any>('benchmark-test')
		mongoTest._ensureIndex({
			indexedProp: 1,
		})
	}
	const cleanup = () => {
		if (mongoTest) {
			// clean up
			mongoTest.remove({})
		}
	}

	const result: BenchmarkResult = {
		mongoWriteSmall: -1,
		mongoWriteBig: -1,
		mongoRead: -1,
		mongoIndexedRead: -1,
		cpuCalculations: -1,
		cpuStringifying: -1,
	}
	// Note: The tests "sizes" / iterations are chosen so that they should run somewhere around 100ms
	try {
		waitTime(10)
		{
			// MongoDB test: Do a number of small writes:
			const startTime = Date.now()
			const insertedIds: string[] = []
			for (let i = 0; i < 100; i++) {
				const objectToInsert = {
					_id: 'myObject' + i,
					prop0: {
						asdf: 'asdf',
						ghjk: 123456,
					},
				}
				insertedIds.push(mongoTest.insert(objectToInsert))
				mongoTest.update(objectToInsert._id, {
					$set: {
						prop1: 'qwerty',
					},
				})
			}
			for (const id of insertedIds) {
				mongoTest.remove(id)
			}
			result.mongoWriteSmall = Date.now() - startTime
		}
		waitTime(10)
		{
			// MongoDB test: Do a number of large writes:
			const startTime = Date.now()
			const insertedIds: string[] = []
			for (let i = 0; i < 10; i++) {
				const objectToInsert = {
					_id: 'myObject' + i,
					objs: _.range(0, 1000).map((j) => {
						return {
							id: 'innerObj' + j,
							data0: 'asdfkawhbeckjawhefkjashvdfckasdf',
							data1: 'we4roivbnworeitgv398rvnw9384rvnf34',
							data2: '234f23f423f4',
							data3: Date.now(),
							data4: 'wvklwjnserolvjwn3erlkvjwnerlkvn',
							data5: '3oig23oi45ugnf2o3iu4nf2o3iu4nf',
							data6: '5g2987543hg9285hg3',
							data7: '20359gj2834hf2390874fh203874hf02387h4f02837h4f0238h028h428734f0273h4f08723h4tpo2n,mnbsdfljbvslfkvnkjgv',
						}
					}),
					prop0: 'asdf',
				}
				insertedIds.push(mongoTest.insert(objectToInsert))
				mongoTest.update(objectToInsert._id, {
					$set: {
						prop1: 'qwerty',
					},
				})
			}
			for (const id of insertedIds) {
				mongoTest.remove(id)
			}
			result.mongoWriteBig = Date.now() - startTime
		}
		{
			// MongoDB test: read
			const DOC_COUNT = 100
			// Prepare data in db:
			const insertedIds: string[] = []
			for (let i = 0; i < DOC_COUNT; i++) {
				const objectToInsert = {
					_id: 'myObject' + i,
					objs: _.range(0, 100).map((j) => {
						return {
							id: 'innerObj' + j,
							data0: 'asdfkawhbeckjawhefkjashvdfckasdf9q37246fg2w9375fhg209485hf0238757h834h08273h50235h4gf+0237h5u7hg2475hg082475hgt',
						}
					}),
					prop0: i,
					indexedProp: i,
				}
				insertedIds.push(mongoTest.insert(objectToInsert))
				mongoTest.update(objectToInsert._id, {
					$set: {
						prop1: 'qwerty',
					},
				})
			}
			waitTime(10)

			// Reads with no help from index:
			let startTime = Date.now()
			for (let i = 0; i < DOC_COUNT; i++) {
				const readData = mongoTest.find({ prop0: i }).fetch()
				if (readData.length !== 1) throw Error('Expected to have read 1 document')
			}
			result.mongoRead = Date.now() - startTime

			// Reads with help from index:
			startTime = Date.now()
			for (let i = 0; i < DOC_COUNT; i++) {
				const readData = mongoTest.find({ indexedProp: i }).fetch()
				if (readData.length !== 1) throw Error('Expected to have read 1 document')
			}
			result.mongoIndexedRead = Date.now() - startTime

			// cleanup:
			mongoTest.remove({})
		}
		waitTime(10)
		// CPU test: arithmetic calculations:
		{
			const startTime = Date.now()
			const map: any = {}
			let number = 0
			for (let i = 0; i < 6e4; i++) {
				number += i
				if (number > 10e5) number -= 10e5
				map[`v_${number}`] = `${number}`.slice(1)
			}
			_.values(map).sort((a, b) => {
				if (a < b) return 1
				if (a > b) return -1
				return 0
			})
			result.cpuCalculations = Date.now() - startTime
		}
		waitTime(10)
		// CPU test: JSON stringifying:
		{
			const objectsToStringify = _.range(0, 40e3).map((i) => {
				return {
					_id: 'myObject' + i,
					prop0: {
						asdf: 'asdf' + i,
						ghjk: 123456,
					},
				}
			})
			const startTime = Date.now()

			const strings: string[] = objectsToStringify.map((o) => JSON.stringify(o))
			const _newObjects = strings.map((str) => JSON.parse(str))

			result.cpuStringifying = Date.now() - startTime
		}
		waitTime(10)

		cleanup()
	} catch (error) {
		cleanup()
		throw error
	}

	return result
}
async function doSystemBenchmark(context: MethodContext, runCount: number = 1): Promise<SystemBenchmarkResults> {
	SystemWriteAccess.coreSystem(context)

	if (runCount < 1) throw new Error(`runCount must be >= 1`)

	const results: BenchmarkResult[] = []
	for (const _i of _.range(0, runCount)) {
		results.push(await doSystemBenchmarkInner())
		waitTime(50)
	}

	const keys: (keyof BenchmarkResult)[] = [
		'mongoWriteSmall',
		'mongoWriteBig',
		'mongoRead',
		'mongoIndexedRead',
		'cpuCalculations',
		'cpuStringifying',
	]

	const sum: BenchmarkResult = results.reduce(
		(prev, current) => {
			const o: any = {}
			keys.forEach((key) => {
				o[key] = current[key] + prev[key]
			})
			return o
		},
		{
			mongoWriteSmall: 0,
			mongoWriteBig: 0,
			mongoRead: 0,
			mongoIndexedRead: 0,
			cpuCalculations: 0,
			cpuStringifying: 0,
		}
	)
	const avg: SystemBenchmarkResults['results'] = {} as any
	keys.forEach((key) => {
		avg[key] = Math.floor(sum[key] / runCount)
	})
	// These numbers are the average performance of known systems
	const baseline = {
		mongoWriteSmall: 178,
		mongoWriteBig: 186,
		mongoRead: 120,
		mongoIndexedRead: 70,
		cpuStringifying: 110,
		cpuCalculations: 114,
	}

	const comparison: any = {}
	keys.forEach((key) => {
		comparison[key] = Math.floor((100 * avg[key]) / baseline[key])
	})

	return {
		description: `Benchmark results, averaged after ${runCount} runs:
MongoDB small writes:        ${avg.mongoWriteSmall} ms (${comparison.mongoWriteSmall}%)
MongoDB large writes:        ${avg.mongoWriteBig} ms (${comparison.mongoWriteBig}%)
MongoDB reads with no index: ${avg.mongoRead} ms (${comparison.mongoRead}%)
MongoDB reads with index:    ${avg.mongoIndexedRead} ms (${comparison.mongoIndexedRead}%)

CPU calculations:            ${avg.cpuCalculations} ms (${comparison.cpuCalculations}%)
CPU JSON stringifying:       ${avg.cpuStringifying} ms (${comparison.cpuStringifying}%)`,
		results: avg,
	}
}

function getTranslationBundle(context: MethodContext, bundleId: TranslationsBundleId) {
	check(bundleId, String)

	OrganizationContentWriteAccess.anyContent(context)
	return ClientAPI.responseSuccess(getTranslationBundleInner(bundleId))
}

class SystemAPIClass extends MethodContextAPI implements SystemAPI {
	async cleanupIndexes(actuallyRemoveOldIndexes: boolean) {
		return makePromise(() => cleanupIndexes(this, actuallyRemoveOldIndexes))
	}
	async cleanupOldData(actuallyRemoveOldData: boolean) {
		return makePromise(() => cleanupOldData(this, actuallyRemoveOldData))
	}
	async doSystemBenchmark(runCount: number = 1) {
		return doSystemBenchmark(this, runCount)
	}
	async getTranslationBundle(bundleId: TranslationsBundleId): Promise<ClientAPI.ClientResponse<TranslationsBundle>> {
		return makePromise(() => getTranslationBundle(this, bundleId))
	}
}
registerClassToMeteorMethods(SystemAPIMethods, SystemAPIClass, false)
