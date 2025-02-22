import { PeripheralDeviceAPI } from '../../lib/api/peripheralDevice'
import { getCurrentTime, Collections } from '../../lib/lib'
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import * as _ from 'underscore'
import { MeteorCall } from '../../lib/api/methods'

// Note: These things are convenience functions to be used during development:

Meteor.startup(() => {
	_.each(Collections, (val, key) => {
		window[key] = val
	})
})

window['Collections'] = Collections
window['executeFunction'] = PeripheralDeviceAPI.executeFunction
window['executeFunctionWithCustomTimeout'] = PeripheralDeviceAPI.executeFunctionWithCustomTimeout
window['getCurrentTime'] = getCurrentTime
window['Session'] = Session

function setDebugData() {
	Tracker.autorun(() => {
		const stats: any = {}
		_.each(Collections, (collection: any, name: string) => {
			stats[name] = collection.find().count()
		})
		console.log(
			_.map(stats, (count: any, name: string) => {
				return name + ': ' + count
			}).join('\n')
		)
	})
}
window['setDebugData'] = setDebugData
const debugData = false
if (debugData) {
	console.log('Debug: comment out this!')
	setDebugData()
}
window['MeteorCall'] = MeteorCall

const expectToRunWithinCache: any = {}
export function expectToRunWithin(name, time: number = 1000) {
	if (expectToRunWithinCache[name]) {
		if (expectToRunWithinCache[name] !== true) {
			Meteor.clearTimeout(expectToRunWithinCache[name])
			expectToRunWithinCache[name] = true
		}
	}
	const timeout = Meteor.setTimeout(() => {
		console.error('Expected to run within ' + time + 'ms: ' + name)
	}, time)
	expectToRunWithinCache[name] = timeout
}
