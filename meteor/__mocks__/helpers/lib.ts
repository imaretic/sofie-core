import * as _ from 'underscore'
import { LogLevel, ProtectedString } from '../../lib/lib'
import { AsyncTransformedCollection } from '../../lib/collections/lib'
import { getLogLevel, setLogLevel } from '../../server/logging'

/*
interface MockedCollection<T, Y extends any[]> {
	mockClear: jest.MockInstance<T, Y>['mockClear']
	mockReset: jest.MockInstance<T, Y>['mockReset']
}
*/
interface MockedCollection {
	mockClear: () => void
	mockReset: () => void
}
const METHOD_NAMES = [
	'allow',
	'deny',
	'find',
	'findOne',
	'insert',
	'rawCollection',
	'rawDatabase',
	'remove',
	'update',
	'upsert',
	'_ensureIndex',
	'_dropIndex',
	'findFetchAsync',
	'findOneAsync',
	'insertAsync',
	'insertManyAsync',
	'insertIgnoreAsync',
	'updateAsync',
	'upsertAsync',
	'removeAsync',
	'bulkWriteAsync',
]

/**
 * Make mocks of all methods of a collection.
 * Important: This Remember to run resetMockupCollection() after the test
 */
export function mockupCollection<A extends B, B extends { _id: ProtectedString<any> }>(
	collection0: AsyncTransformedCollection<A, B>
): AsyncTransformedCollection<A, B> & MockedCollection {
	const collection = collection0 as AsyncTransformedCollection<A, B> & MockedCollection

	_.each(METHOD_NAMES, (methodName) => {
		collection['__original' + methodName] = collection[methodName]
		collection[methodName] = jest.fn(collection[methodName])
	})

	collection.mockClear = () => {
		_.each(METHOD_NAMES, (methodName) => collection[methodName].mockClear())
	}
	collection.mockReset = () => {
		_.each(METHOD_NAMES, (methodName) => collection[methodName].mockReset())
	}

	return collection
}
export function resetMockupCollection<A extends B, B extends { _id: ProtectedString<any> }>(
	collection: AsyncTransformedCollection<A, B>
): void {
	_.each(METHOD_NAMES, (methodName) => {
		collection[methodName] = collection['__original' + methodName]
		delete collection['__original' + methodName]
	})
}

/** Supresses logging for the duration of the callback */
export async function supressLogging(cb: () => void | Promise<void>, allowErrors = false): Promise<void> {
	const orgLogLevel = getLogLevel()

	if (allowErrors) {
		setLogLevel(LogLevel.ERROR)
	} else {
		setLogLevel(LogLevel.NONE)
	}
	try {
		const returnValue = await Promise.resolve(cb())
		setLogLevel(orgLogLevel)
		return returnValue
	} catch (err) {
		setLogLevel(orgLogLevel)
		throw err
	}
}
