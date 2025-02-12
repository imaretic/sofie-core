import { testInFiber } from '../../../../__mocks__/helpers/jest'
import { supressLogging } from '../../../../__mocks__/helpers/lib'
import { logger } from '../../../logging'

describe('server/logger', () => {
	testInFiber('supress errors', async () => {
		// These should suppress all messages from being logged:
		await supressLogging(() => {
			logger.debug('This is a debug message')
			logger.info('This is an info message')
			logger.warn('This is a warn message')
			logger.error('This is an error message')
		})

		// These should suppress all but errors:
		await supressLogging(() => {
			logger.debug('This is a debug message')
			logger.info('This is an info message')
			logger.warn('This is a warn message')
			logger.error('This is an error message')
		}, true)
		expect(1).toBe(1)
	})
})
