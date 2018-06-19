import * as React from 'react'
import { RuntimeFunction, RuntimeFunctions } from '../../../lib/collections/RuntimeFunctions'
import { EditAttribute, EditAttributeBase } from '../../lib/EditAttribute'
import { Translated, translateWithTracker } from '../../lib/ReactMeteorData/react-meteor-data'
import { Spinner } from '../../lib/Spinner'
// import * as monaco from 'monaco-editor' // instead globally available through public folder
// import MonacoEditor from 'react-monaco-editor'
import '../../../lib/typings/monaco'
import { getCurrentTime } from '../../../lib/lib'
import * as _ from 'underscore'
import { RuntimeFunctionsAPI } from '../../../lib/api/runtimeFunctions'

interface IMonacoProps {
	runtimeFunction: RuntimeFunction
}
interface IMonacoState {
	unsavedChanges: boolean
	saving: boolean
	message: string

}
class MonacoWrapper extends React.Component<IMonacoProps, IMonacoState> {
	static _monacoRequire: any
	static _requireBuffer: any
	static _monacoRef: any

	_container: HTMLDivElement
	_editor: monaco.editor.IStandaloneCodeEditor
	_codeId: string
	private _saveTimeout: any
	private _testTimeout: any
	private _currentCode: string

	constructor (props) {
		super(props)

		this.state = {
			unsavedChanges: false,
			saving: false,
			message: ''
		}
	}

	attachEditor = () => {
		// Extra libraries
		let libName = 'tmp.d.ts'
		if (!monaco.languages.typescript.javascriptDefaults['_extraLibs'][libName]) {
			monaco.languages.typescript.javascriptDefaults.addExtraLib(`
declare enum IMOSObjectStatus {
	NEW = "NEW",
	UPDATED = "UPDATED",
	MOVED = "MOVED",
	BUSY = "BUSY",
	DELETED = "DELETED",
	NCS_CTRL = "NCS CTRL",
	MANUAL_CTRL = "MANUAL CTRL",
	READY = "READY",
	NOT_READY = "NOT READY",
	PLAY = "PLAY",
	STOP = "STOP",
}
declare enum IMOSObjectAirStatus {
	READY = "READY",
	NOT_READY = "NOT READY",
}
declare enum IMOSObjectAirStatus {
    READY = "READY",
    NOT_READY = "NOT READY",
}
declare interface IMOSObjectPath {
    Type: IMOSObjectPathType;
    Description: string;
    Target: string;
}
declare declare enum IMOSObjectPathType {
    PATH = "PATH",
    PROXY_PATH = "PROXY PATH",
    METADATA_PATH = "METADATA PATH",
}
declare type Time = number
declare interface DBRunningOrder {
	_id: string
	/** ID of the object in MOS */
	mosId: string
	studioInstallationId: string
	showStyleId: string
	/** the mos device the rundown originates from */
	mosDeviceId: string
	/** Rundown slug - user-presentable name */
	name: string
	created: Time
	modified: Time

	/** Expected start should be set to the expected time this running order should run on air. Should be set to EditorialStart from IMOSRunningOrder */
	expectedStart?: Time
	/** Expected duration of the running order - should be set to EditorialDuration from IMOSRunningOrder */
	expectedDuration?: number

	metaData?: Array<IMOSExternalMetaData>
	status?: IMOSObjectStatus
	airStatus?: IMOSObjectAirStatus
	// There should be something like a Owner user here somewhere?
	active?: boolean
	/** the id of the Live Segment Line - if empty, no segment line in this rundown is live */
	currentSegmentLineId: string | null
	/** the id of the Next Segment Line - if empty, no segment will follow Live Segment Line */
	nextSegmentLineId: string | null
	/** the id of the Previous Segment Line - cleared once playback of the currentSegmentLine has been confirmed by TSR */
	previousSegmentLineId: string | null

	/** Actual time of playback starting */
	startedPlayback?: Time
}
declare interface IMOSExternalMetaData {
	MosScope?: IMOSScope;
	MosSchema: string;
	MosPayload: any;
}
declare enum IMOSScope {
	OBJECT = "OBJECT",
	STORY = "STORY",
	PLAYLIST = "PLAYLIST",
}
declare interface MosExternalMetaData {
	private _scope?;
	private _schema;
	private _payload;
	constructor(obj: IMOSExternalMetaData);
	readonly scope: IMOSScope | undefined;
	readonly schema: string;
	readonly payload: any;
	readonly messageXMLBlocks: any
}
declare interface DBSegmentLine {
	/** ID of the SegmentLine*/
	_id: string
	/** Position inside the segment */
	_rank: number
	/** ID of the source object in MOS */
	mosId: string
	/** The segment ("Title") this line belongs to */
	segmentId: string
	/** The running order this line belongs to */
	runningOrderId: string
	/** The story Slug (like a title, but slimier) */
	slug: string
	/** Should this item should progress to the next automatically */
	autoNext?: boolean
	/** The duration to run overlap with the previous SegmentLine */
	overlapDuration?: number
	/** Should we block a transition at the out of this SegmentLine */
	disableOutTransition?: boolean

	metaData?: Array<IMOSExternalMetaData>
	// status?: IMOSObjectStatus

	/** Expected duration of the line, in milliseconds */
	expectedDuration?: number

	/** The time the system started playback of this segment line, null if not yet played back (milliseconds since epoch) */
	startedPlayback?: number
	/** The time the system played back this segment line, null if not yet finished playing, in milliseconds */
	duration?: number
}
declare type SegmentLine = DBSegmentLine
declare enum LayerType {
	Source,
	Output,
	LLayer,
}
declare interface Context {
	runningOrderId: string
	segmentLine: SegmentLine

	getHashId: (stringToBeHashed?: string | number) => string
	unhashId: (hash: string) => string
	getLayer: (type: LayerType, key: string) => string
	getConfigValue: (key: string, defaultValue?: any) => any
	getValueByPath: (sourceObject: object | undefined, pathToAttributeInObject: string, defaultValue?: any) => any
	getHelper: (functionId: string) => Function
	error: (messageToThrow: string) => void
	warning: (messageToLog: string) => void
	getSegmentLines (): Array<SegmentLine>
	getSegmentLineIndex (): number
}
type MosString128 = string
type Duration = number
declare interface IMOSItem {
    ID: MosString128;
    Slug?: MosString128;
    ObjectID: MosString128;
    MOSID: string;
    mosAbstract?: string;
    Paths?: Array<IMOSObjectPath>;
    Channel?: MosString128;
    EditorialStart?: number;
    EditorialDuration?: number;
    UserTimingDuration?: number;
    Trigger?: any;
    MacroIn?: MosString128;
    MacroOut?: MosString128;
    MosExternalMetaData?: Array<IMOSExternalMetaData>;
    MosObjects?: Array<IMOSObject>;
}
declare interface IMOSROFullStoryBodyItem {
    Type: string;
    Content: any | IMOSItem;
}
declare interface IMOSROFullStory extends IMOSStory {
    RunningOrderId: MosString128;
    Body: Array<IMOSROFullStoryBodyItem>;
}
declare type Story = IMOSROFullStory

declare enum TriggerType {
    TIME_ABSOLUTE = 0,
    TIME_RELATIVE = 1,
    LOGICAL = 3
}

export type TimelineContentTypeAny =
	TimelineContentTypeOther |
	TimelineContentTypeCasparCg |
	TimelineContentTypeLawo |
	TimelineContentTypeAtem |
	TimelineContentTypeHttp

export enum TimelineContentTypeOther {
	NOTHING = 'nothing',
	GROUP = 'group',
}
export enum TimelineContentTypeCasparCg { //  CasparCG-state/TSR
	VIDEO = 'video', // later to be deprecated & replaced by MEDIA
	AUDIO = 'audio', // later to be deprecated & replaced by MEDIA
	MEDIA = 'media',
	IP = 'ip',
	INPUT = 'input',
	TEMPLATE = 'template',
	HTMLPAGE = 'htmlpage',
	ROUTE = 'route',
	RECORD = 'record'
}
export enum TimelineContentTypeLawo { // lawo-state
	SOURCE = 'lawosource'
}
export enum TimelineContentTypeAtem { //  Atem-state
	ME = 'me',
	DSK = 'dsk',
	AUX = 'aux',
	SSRC = 'ssrc',
	MEDIAPLAYER = 'mp'
}
export enum TimelineContentTypeHttp {
	POST = 'post'
}
export namespace Atem_Enums {
	export enum TransitionStyle {
		MIX = 0,
		DIP = 1,
		WIPE = 2,
		DVE = 3,
		STING = 4,
		CUT = 5,
	}

	export enum SourceIndex {
		Blk = 0,
		Bars = 1000,
		Col1 = 2001,
		Col2 = 2002,
		MP1 = 3010,
		MP1K = 3011,
		MP2 = 3020,
		MP2K = 3021,
		SSrc = 6000,
		Cfd1 = 7001,
		Cfd2 = 7002,
		Aux1 = 8001,
		Aux2 = 8002,
		Aux3 = 8003,
		Aux4 = 8004,
		Aux5 = 8005,
		Aux6 = 8006,
		Prg1 = 10010,
		Prv1 = 10011,
		Prg2 = 10020,
		Prv2 = 10021
	}
}
export enum EmberPlusValueType {
	REAL 	= 'real',
	INT 	= 'int',
	BOOLEAN = 'boolean',
	STRING 	= 'string'
}
export enum Transition {
	MIX = 'MIX',
	CUT = 'CUT',
	PUSH = 'PUSH',
	WIPE = 'WIPE',
	SLIDE = 'SLIDE'
}

export enum Ease {
	LINEAR = 'LINEAR',
	NONE = 'NONE',
	EASEINBACK = 'EASEINBACK',
	EASEINBOUNCE = 'EASEINBOUNCE',
	EASEINCIRC = 'EASEINCIRC',
	EASEINCUBIC = 'EASEINCUBIC',
	EASEINELASTIC = 'EASEINELASTIC',
	EASEINEXPO = 'EASEINEXPO',
	EASEINOUTBACK = 'EASEINOUTBACK',
	EASEINOUTBOUNCE = 'EASEINOUTBOUNCE',
	EASEINOUTCIRC = 'EASEINOUTCIRC',
	EASEINOUTCUBIC = 'EASEINOUTCUBIC',
	EASEINOUTELASTIC = 'EASEINOUTELASTIC',
	EASEINOUTEXPO = 'EASEINOUTEXPO',
	EASEINOUTQUAD = 'EASEINOUTQUAD',
	EASEINOUTQUART = 'EASEINOUTQUART',
	EASEINOUTQUINT = 'EASEINOUTQUINT',
	EASEINOUTSINE = 'EASEINOUTSINE',
	EASEINQUAD = 'EASEINQUAD',
	EASEINQUART = 'EASEINQUART',
	EASEINQUINT = 'EASEINQUINT',
	EASEINSINE = 'EASEINSINE',
	EASELINEAR = 'EASELINEAR',
	EASENONE = 'EASENONE',
	EASEOUTBACK = 'EASEOUTBACK',
	EASEOUTBOUNCE = 'EASEOUTBOUNCE',
	EASEOUTCIRC = 'EASEOUTCIRC',
	EASEOUTCUBIC = 'EASEOUTCUBIC',
	EASEOUTELASTIC = 'EASEOUTELASTIC',
	EASEOUTEXPO = 'EASEOUTEXPO',
	EASEOUTINBACK = 'EASEOUTINBACK',
	EASEOUTINBOUNCE = 'EASEOUTINBOUNCE',
	EASEOUTINCIRC = 'EASEOUTINCIRC',
	EASEOUTINCUBIC = 'EASEOUTINCUBIC',
	EASEOUTINELASTIC = 'EASEOUTINELASTIC',
	EASEOUTINEXPO = 'EASEOUTINEXPO',
	EASEOUTINQUAD = 'EASEOUTINQUAD',
	EASEOUTINQUART = 'EASEOUTINQUART',
	EASEOUTINQUINT = 'EASEOUTINQUINT',
	EASEOUTINSINE = 'EASEOUTINSINE',
	EASEOUTQUAD = 'EASEOUTQUAD',
	EASEOUTQUART = 'EASEOUTQUART',
	EASEOUTQUINT = 'EASEOUTQUINT',
	EASEOUTSINE = 'EASEOUTSINE',
	IN_BACK = 'IN_BACK',
	IN_BOUNCE = 'IN_BOUNCE',
	IN_CIRC = 'IN_CIRC',
	IN_CUBIC = 'IN_CUBIC',
	IN_ELASTIC = 'IN_ELASTIC',
	IN_EXPO = 'IN_EXPO',
	IN_OUT_BACK = 'IN_OUT_BACK',
	IN_OUT_BOUNCE = 'IN_OUT_BOUNCE',
	IN_OUT_CIRC = 'IN_OUT_CIRC',
	IN_OUT_CUBIC = 'IN_OUT_CUBIC',
	IN_OUT_ELASTIC = 'IN_OUT_ELASTIC',
	IN_OUT_EXPO = 'IN_OUT_EXPO',
	IN_OUT_QUAD = 'IN_OUT_QUAD',
	IN_OUT_QUART = 'IN_OUT_QUART',
	IN_OUT_QUINT = 'IN_OUT_QUINT',
	IN_OUT_SINE = 'IN_OUT_SINE',
	IN_QUAD = 'IN_QUAD',
	IN_QUART = 'IN_QUART',
	IN_QUINT = 'IN_QUINT',
	IN_SINE = 'IN_SINE',
	OUT_BACK = 'OUT_BACK',
	OUT_BOUNCE = 'OUT_BOUNCE',
	OUT_CIRC = 'OUT_CIRC',
	OUT_CUBIC = 'OUT_CUBIC',
	OUT_ELASTIC = 'OUT_ELASTIC',
	OUT_EXPO = 'OUT_EXPO',
	OUT_IN_BACK = 'OUT_IN_BACK',
	OUT_IN_BOUNCE = 'OUT_IN_BOUNCE',
	OUT_IN_CIRC = 'OUT_IN_CIRC',
	OUT_IN_CUBIC = 'OUT_IN_CUBIC',
	OUT_IN_ELASTIC = 'OUT_IN_ELASTIC',
	OUT_IN_EXPO = 'OUT_IN_EXPO',
	OUT_IN_QUAD = 'OUT_IN_QUAD',
	OUT_IN_QUART = 'OUT_IN_QUART',
	OUT_IN_QUINT = 'OUT_IN_QUINT',
	OUT_IN_SINE = 'OUT_IN_SINE',
	OUT_QUAD = 'OUT_QUAD',
	OUT_QUART = 'OUT_QUART',
	OUT_QUINT = 'OUT_QUINT',
}

export enum Direction {
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
}

// RunDownAPI
export enum LineItemStatusCode {
	/** No status has been determined (yet) */
	UNKNOWN = -1,
	/** No fault with item, can be played */
	OK = 0,
	/** The source (file, live input) is missing and cannot be played, as it would result in BTA */
	SOURCE_MISSING = 1,
	/** The source is present, but should not be played due to a technical malfunction (file is broken, camera robotics failed, REMOTE input is just bars, etc.) */
	SOURCE_BROKEN = 2
}
`, libName)
		}

		this._editor = monaco.editor.create(document.getElementById('monaco-container')!, {
			value: this.props.runtimeFunction.code,
			language: 'javascript',
			automaticLayout: true,
		})
		this._editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
			this.triggerSave(this._editor.getModel().getValue())
		})
	}

	componentDidUpdate () {
		// console.log('componentDidUpdate')
		/*
		if (this.props.runtimeFunction._id !== this._codeId) {
			this._codeId = this.props.runtimeFunction._id
			this._editor.setModel(monaco.editor.createModel(
				this.props.runtimeFunction.code,
				'javascript'
			))
		}
		*/
	}

	setRef = (el: HTMLDivElement) => {
		if (el) {
			if (!MonacoWrapper._monacoRef) {
				// let that = this
				this._container = el
				MonacoWrapper._requireBuffer = window['require']
				window['require'] = undefined
				let newScript = document.createElement('script')
				newScript.addEventListener('load', () => {
					MonacoWrapper._monacoRequire = MonacoWrapper._monacoRequire || window['require']
					window['require'] = MonacoWrapper._requireBuffer
					MonacoWrapper._monacoRequire.config({ paths: { 'vs': '/monaco-editor/min/vs' } })
					MonacoWrapper._monacoRequire(['vs/editor/editor.main'], () => {
						MonacoWrapper._monacoRef = monaco
						this.attachEditor()
					})
				})
				newScript.src = '/monaco-editor/min/vs/loader.js'
				el.appendChild(newScript)
			} else {
				this.attachEditor()
			}
		}
	}

	triggerSave (newCode) {
		this.setState({
			unsavedChanges: true
		})
		this._currentCode = newCode

		// Auto-save in a while:
		// if (this._saveTimeout) Meteor.clearTimeout(this._saveTimeout)
		// this._saveTimeout = Meteor.setTimeout(() => {
		// 	this.saveCode()
		// }, 30 * 1000)

		// Auto-test in a while:
		if (this._testTimeout) Meteor.clearTimeout(this._testTimeout)
		this._testTimeout = Meteor.setTimeout(() => {
			this.testCode()
		}, 3 * 1000)
	}

	testCode () {
		console.log('testCode')
		if (this._currentCode ) {
			console.log(this._currentCode)
			Meteor.call(RuntimeFunctionsAPI.TESTCODE, this._currentCode, this.props.runtimeFunction.showStyleId, this.props.runtimeFunction.isHelper, (e) => {
				if (e) {
					this.setState({
						message: 'Error when testing code: ' + e.toString()
					})
					console.log('e')
					console.log(e)
				} else {
					this.setState({
						message: 'Test ok'
					})
				}
			})
		}
	}
	saveCode () {
		this.setState({
			saving: true
		})
		// console.log('saving...')
		if (this._currentCode) {
			Meteor.call(RuntimeFunctionsAPI.UPDATECODE, this.props.runtimeFunction._id, this._currentCode, (e) => {
				if (e) {
					this.setState({
						message: e.toString()
					})
					console.log(e)
				} else {
					// console.log('saved')
					this.setState({
						unsavedChanges: false,
						saving: false,
						message: 'Saved OK'
					})
				}
			})
		} else {
			this.setState({
				saving: false,
				message: 'Did not save, because template is empty'
			})
		}
	}

	render () {
		return <div ref={this.setRef}>
					<div id='monaco-container' className='runtime-function-edit__editor'></div>
					<div>
						{this.state.unsavedChanges ? (
							<div>
								<b>Unsaved changes </b>
								<button className='action-btn' onClick={(e) => this.saveCode()}>
									Save
								</button>
							</div>
						) : null}
						{this.state.saving ? ' Saving...' : ''}
					</div>
					<div>
						<pre>{this.state.message }</pre>
					</div>
			   </div>
	}
}

interface IProps {
	match: {
		params: {
			ltId: string
		}
	}
}
interface IState {
	code: string
}
interface ITrackedProps {
	lineTemplate?: RuntimeFunction
}
export default translateWithTracker<IProps, IState, ITrackedProps>((props: IProps) => {
	return {
		lineTemplate: RuntimeFunctions.findOne(props.match.params.ltId)
	}
})(class LineTemplates extends React.Component<Translated<IProps & ITrackedProps>, IState> {
	updateTemplateId (edit: EditAttributeBase, newValue: any) {
		Meteor.call(RuntimeFunctionsAPI.UPDATETEMPLATEID, edit.props.obj._id, newValue, (err, res) => {
			if (err) {
				console.log(err)
			} else {
				// Nothing
			}
		})
	}
	updateIsHelper (edit: EditAttributeBase, newValue: any) {
		Meteor.call(RuntimeFunctionsAPI.UPDATEISHELPER, edit.props.obj._id, newValue, (err, res) => {
			if (err) {
				console.log(err)
			} else {
				// Nothing
			}
		})
	}
	renderEditForm () {
		const { t } = this.props

		if (this.props.lineTemplate) {
			// @todo - disable editing of fields on getId template
			return (
				<div className='studio-edit mod mhl mvs'>
					<div>
						<label className='field'>
							{t('Template ID')}
							<div className='mdi'>
								<EditAttribute
									modifiedClassName='bghl'
									attribute='templateId'
									obj={this.props.lineTemplate}
									type='text'
									collection={RuntimeFunctions}
									className='mdinput'
									updateFunction={this.updateTemplateId}
								/>
								<span className='mdfx'></span>
							</div>
						</label>
						<label className='field'>
							{t('Is Helper')}
							<div className='mdi'>
								<EditAttribute
									modifiedClassName='bghl'
									attribute='isHelper'
									obj={this.props.lineTemplate}
									type='checkbox'
									collection={RuntimeFunctions}
									className='mdinput'
									updateFunction={this.updateIsHelper}
								/>
								<span className='mdfx'></span>
							</div>
						</label>
					</div>
					<MonacoWrapper runtimeFunction={this.props.lineTemplate} />
				</div>
			)
		}
		return null
	}

	render () {
		const { t } = this.props

		if (this.props.lineTemplate) {
			return this.renderEditForm()
		} else {
			return <Spinner />
		}
	}
})
