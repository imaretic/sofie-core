import { registerCollection, ProtectedString } from '../lib'
import { SourceLayerType } from '@sofie-automation/blueprints-integration'
import { createMongoCollection } from './lib'
import { BlueprintId } from './Blueprints'
import { ShowStyleBaseId } from './ShowStyleBases'
import { UserId } from './Users'
import { registerIndex } from '../database'
import { DashboardPanel } from '../../client/ui/Shelf/DashboardPanel'

/**
 * The view targeted by this layout:
 * RUNDOWN_LAYOUT: a Rundown view for highly scripted shows: a show split into Segments and Parts,
 * 				   accurate timing on each of those with over/under etc.
 * DASHBOARD_LAYOUT: a Dashboard view for AdLib shows (low-scripted): a list of buttons and some generic show layout
 *
 * @export
 * @enum {string}
 */
export enum RundownLayoutType {
	RUNDOWN_VIEW_LAYOUT = 'rundown_view_layout',
	RUNDOWN_LAYOUT = 'rundown_layout',
	DASHBOARD_LAYOUT = 'dashboard_layout',
	RUNDOWN_HEADER_LAYOUT = 'rundown_header_layout',
	CLOCK_PRESENTER_VIEW_LAYOUT = 'clock_presenter_view_layout',
}

export enum CustomizableRegions {
	RundownView = 'rundown_view_layouts',
	Shelf = 'shelf_layouts',
	MiniShelf = 'mini_shelf_layouts',
	RundownHeader = 'rundown_header_layouts',
	PresenterView = 'presenter_view_layouts',
}

/**
 * Display style to be used by this filter
 *
 * @export
 * @enum {string}
 */
export enum PieceDisplayStyle {
	LIST = 'list',
	BUTTONS = 'buttons',
}

export enum RundownLayoutElementType {
	FILTER = 'filter',
	EXTERNAL_FRAME = 'external_frame',
	ADLIB_REGION = 'adlib_region',
	PIECE_COUNTDOWN = 'piece_countdown',
	NEXT_INFO = 'next_info',
	PLAYLIST_START_TIMER = 'playlist_start_timer',
	PLAYLIST_END_TIMER = 'playlist_end_timer',
	END_WORDS = 'end_words',
	SEGMENT_TIMING = 'segment_timing',
	PART_TIMING = 'part_timing',
	TEXT_LABEL = 'text_label',
	PLAYLIST_NAME = 'playlist_name',
	STUDIO_NAME = 'studio_name',
	TIME_OF_DAY = 'time_of_day',
	SYSTEM_STATUS = 'system_status',
	SHOWSTYLE_DISPLAY = 'showstyle_display',
	SEGMENT_NAME = 'segment_name',
	PART_NAME = 'part_name',
	COLORED_BOX = 'colored_box',
}

export interface RundownLayoutElementBase {
	_id: string
	name: string
	rank: number
	type?: RundownLayoutElementType // if not set, the value is RundownLayoutElementType.FILTER
}

/**
 * An interface for filters that check for a piece to be present on a source layer to change their behaviour (or in order to perform any action at all).
 * If `requiredLayerIds` is empty / undefined, the filter should be treated as "always active".
 * @param requiredLayerIds Layers that the filter will check for some active ('live') piece. (Match any layer in array).
 * @param additionalLayers Layers that must be active in addition to the active layers, i.e. "any of `requiredLayerIds`, with at least one of `additionalLayers`".
 * @param requireAllAdditionalSourcelayers Require all layers in `additionalLayers` to contain an active piece.
 */
export interface RequiresActiveLayers {
	requiredLayerIds?: string[]
	additionalLayers?: string[]
	/**
	 * Require that all additional sourcelayers be active.
	 * This allows behaviour to be tied to a combination of e.g. script + VT.
	 */
	requireAllAdditionalSourcelayers: boolean
}

export interface RundownLayoutExternalFrame extends RundownLayoutElementBase {
	type: RundownLayoutElementType.EXTERNAL_FRAME
	url: string
}

export enum RundownLayoutAdLibRegionRole {
	QUEUE = 'queue',
	TAKE = 'take',
	PROGRAM = 'program',
}

export interface RundownLayoutAdLibRegion extends RundownLayoutElementBase {
	type: RundownLayoutElementType.ADLIB_REGION
	tags: string[] | undefined
	role: RundownLayoutAdLibRegionRole
	adlibRank: number
	labelBelowPanel: boolean
}

export interface RundownLayoutPieceCountdown extends RundownLayoutElementBase {
	type: RundownLayoutElementType.PIECE_COUNTDOWN
	sourceLayerIds: string[] | undefined
}

export interface RundownLayoutNextInfo extends RundownLayoutElementBase {
	type: RundownLayoutElementType.NEXT_INFO
	showSegmentName: boolean
	showPartTitle: boolean
	hideForDynamicallyInsertedParts: boolean
}

export interface RundownLayoutPlaylistStartTimer extends RundownLayoutElementBase {
	type: RundownLayoutElementType.PLAYLIST_START_TIMER
	plannedStartText: string
	hideDiff: boolean
	hidePlannedStart: boolean
}

export interface RundownLayoutPlaylistEndTimer extends RundownLayoutElementBase {
	type: RundownLayoutElementType.PLAYLIST_END_TIMER
	headerHeight: string
	plannedEndText: string
	hidePlannedEndLabel: boolean
	hideDiffLabel: boolean
	hideCountdown: boolean
	hideDiff: boolean
	hidePlannedEnd: boolean
}

export interface RundownLayoutEndWords extends RundownLayoutElementBase, RequiresActiveLayers {
	type: RundownLayoutElementType.PLAYLIST_END_TIMER
	hideLabel: boolean
}

export interface RundownLayoutSegmentTiming extends RundownLayoutElementBase, RequiresActiveLayers {
	type: RundownLayoutElementType.SEGMENT_TIMING
	timingType: 'count_down' | 'count_up'
	hideLabel: boolean
}

export interface RundownLayoutPartTiming extends RundownLayoutElementBase, RequiresActiveLayers {
	type: RundownLayoutElementType.PART_TIMING
	timingType: 'count_down' | 'count_up'
	speakCountDown: boolean
	hideLabel: boolean
}

export interface RundownLayoutTextLabel extends RundownLayoutElementBase {
	type: RundownLayoutElementType.TEXT_LABEL
	text: string
}

export interface RundownLayoutPlaylistName extends RundownLayoutElementBase {
	type: RundownLayoutElementType.PLAYLIST_NAME
	showCurrentRundownName: boolean
}

export interface RundownLayoutStudioName extends RundownLayoutElementBase {
	type: RundownLayoutElementType.STUDIO_NAME
}

export interface RundownLayoutTimeOfDay extends RundownLayoutElementBase {
	type: RundownLayoutElementType.TIME_OF_DAY
	hideLabel: boolean
}

export interface RundownLayoutSytemStatus extends RundownLayoutElementBase {
	type: RundownLayoutElementType.SYSTEM_STATUS
}

export interface RundownLayoutShowStyleDisplay extends RundownLayoutElementBase {
	type: RundownLayoutElementType.SHOWSTYLE_DISPLAY
}

export interface RundownLayoutSegmentName extends RundownLayoutElementBase {
	type: RundownLayoutElementType.SEGMENT_NAME
	segment: 'current' | 'next'
}

export interface RundownLayoutPartName extends RundownLayoutElementBase {
	type: RundownLayoutElementType.PART_NAME
	part: 'current' | 'next'
	showPieceIconColor: boolean
}

export interface RundownLayoutColoredBox extends RundownLayoutElementBase {
	type: RundownLayoutElementType.COLORED_BOX
	iconColor: string
}

/**
 * A filter to be applied against the AdLib Pieces. If a member is undefined, the pool is not tested
 * against that filter. A member must match all of the sub-filters to be included in a filter view
 *
 * @export
 * @interface RundownLayoutFilter
 */
export interface RundownLayoutFilterBase extends RundownLayoutElementBase {
	type: RundownLayoutElementType.FILTER
	sourceLayerIds: string[] | undefined
	sourceLayerTypes: SourceLayerType[] | undefined
	outputLayerIds: string[] | undefined
	label: string[] | undefined
	tags: string[] | undefined
	displayStyle: PieceDisplayStyle
	showThumbnailsInList: boolean
	hideDuplicates: boolean
	currentSegment: boolean
	nextInCurrentPart: boolean
	oneNextPerSourceLayer: boolean
	/**
	 * true: include Rundown Baseline AdLib Pieces
	 * false: do not include Rundown Baseline AdLib Pieces
	 * 'only': show only Rundown Baseline AdLib Pieces matching this filter
	 */
	rundownBaseline: boolean | 'only'
}

export interface RundownLayoutFilter extends RundownLayoutFilterBase {
	default: boolean
}

export interface DashboardPanelBase {
	x: number
	y: number
	width: number
	height: number
	scale?: number
	customClasses?: string[]
}

type DashboardPanel<T> = T & DashboardPanelBase

export type DashboardLayoutExternalFrame = DashboardPanel<RundownLayoutExternalFrame>
export type DashboardLayoutAdLibRegion = DashboardPanel<RundownLayoutAdLibRegion>
export type DashboardLayoutPieceCountdown = DashboardPanel<RundownLayoutPieceCountdown>
export type DashboardLayoutNextInfo = DashboardPanel<RundownLayoutNextInfo>
export type DashboardLayoutPlaylistStartTimer = DashboardPanel<RundownLayoutPlaylistStartTimer>
export type DashboardLayoutPlaylistEndTimer = DashboardPanel<RundownLayoutPlaylistEndTimer>
export type DashboardLayoutEndsWords = DashboardPanel<RundownLayoutEndWords>
export type DashboardLayoutSegmentCountDown = DashboardPanel<RundownLayoutSegmentTiming>
export type DashboardLayoutPartCountDown = DashboardPanel<RundownLayoutPartTiming>
export type DashboardLayoutTextLabel = DashboardPanel<RundownLayoutTextLabel>
export type DashboardLayoutPlaylistName = DashboardPanel<RundownLayoutPlaylistName>
export type DashboardLayoutStudioName = DashboardPanel<RundownLayoutStudioName>
export type DashboardLayoutTimeOfDay = DashboardPanel<RundownLayoutTimeOfDay>
export type DashboardLayoutSystemStatus = DashboardPanel<RundownLayoutSytemStatus>
export type DashboardLayoutShowStyleDisplay = DashboardPanel<RundownLayoutShowStyleDisplay>
export type DashboardLayoutSegmentName = DashboardPanel<RundownLayoutSegmentName>
export type DashboardLayoutPartName = DashboardPanel<RundownLayoutPartName>
export type DashboardLayoutColoredBox = DashboardPanel<RundownLayoutColoredBox>
export type DashboardLayoutFilter = DashboardPanel<
	RundownLayoutFilterBase & {
		enableSearch: boolean

		buttonWidthScale: number
		buttonHeightScale: number

		includeClearInRundownBaseline: boolean
		assignHotKeys: boolean
		overflowHorizontally?: boolean
		showAsTimeline?: boolean
		hide?: boolean
		displayTakeButtons?: boolean
		queueAllAdlibs?: boolean
		toggleOnSingleClick?: boolean
	}
>

/** A string, identifying a RundownLayout */
export type RundownLayoutId = ProtectedString<'RundownLayoutId'>

export interface RundownLayoutBase {
	_id: RundownLayoutId
	showStyleBaseId: ShowStyleBaseId
	blueprintId?: BlueprintId
	userId?: UserId
	name: string
	type: RundownLayoutType
	icon: string
	iconColor: string
	/* Customizable region that the layout modifies. */
	regionId: CustomizableRegions
}

export interface RundownLayoutWithFilters extends RundownLayoutBase {
	filters: RundownLayoutElementBase[]
}

export interface RundownViewLayout extends RundownLayoutBase {
	type: RundownLayoutType.RUNDOWN_VIEW_LAYOUT
	/** Expose as a layout that can be selected by the user in the lobby view */
	exposeAsSelectableLayout: boolean
	shelfLayout: RundownLayoutId
	miniShelfLayout: RundownLayoutId
	rundownHeaderLayout: RundownLayoutId
	liveLineProps?: RequiresActiveLayers
	/** Hide the rundown divider header in playlists */
	hideRundownDivider: boolean
	/** Show breaks in segment timeline list */
	showBreaksAsSegments: boolean
	/** Only count down to the segment if it contains pieces on these layers */
	countdownToSegmentRequireLayers: string[]
	/** Always show planned segment duration instead of counting up/down when the segment is live */
	fixedSegmentDuration: boolean
	/** Show only the listed source layers in the RundownView (sourceLayerIds) */
	visibleSourceLayers?: string[]
	/** Show only the listed output groups in the RundownView (outputLayerIds) */
	visibleOutputLayers?: string[]
}

export interface RundownLayoutShelfBase extends RundownLayoutWithFilters {
	exposeAsStandalone: boolean
	openByDefault: boolean
	startingHeight?: number
}

export interface RundownLayout extends RundownLayoutShelfBase {
	type: RundownLayoutType.RUNDOWN_LAYOUT
}

export interface RundownLayoutRundownHeader extends RundownLayoutBase {
	type: RundownLayoutType.RUNDOWN_HEADER_LAYOUT
	plannedEndText: string
	nextBreakText: string
	/** When true, hide the Planned End timer when there is a rundown marked as a break in the future */
	hideExpectedEndBeforeBreak: boolean
	/** When a rundown is marked as a break, show the Next Break timing */
	showNextBreakTiming: boolean
	/** If true, don't treat the last rundown as a break even if it's marked as one */
	lastRundownIsNotBreak: boolean
}

export interface RundownLayoutPresenterView extends RundownLayoutBase {
	type: RundownLayoutType.CLOCK_PRESENTER_VIEW_LAYOUT
}

export enum ActionButtonType {
	TAKE = 'take',
	HOLD = 'hold',
	MOVE_NEXT_PART = 'move_next_part',
	MOVE_NEXT_SEGMENT = 'move_next_segment',
	MOVE_PREVIOUS_PART = 'move_previous_part',
	MOVE_PREVIOUS_SEGMENT = 'move_previous_segment',
	// ACTIVATE = 'activate',
	// ACTIVATE_REHEARSAL = 'activate_rehearsal',
	// DEACTIVATE = 'deactivate',
	// RESET_RUNDOWN = 'reset_rundown',
	QUEUE_ADLIB = 'queue_adlib', // The idea for it is that you would be able to press and hold this button
	// and then click on whatever adlib you would like
}

export interface DashboardLayoutActionButton extends DashboardPanelBase {
	_id: string
	type: ActionButtonType
	label: string
}

export interface DashboardLayout extends RundownLayoutShelfBase {
	type: RundownLayoutType.DASHBOARD_LAYOUT
	actionButtons?: DashboardLayoutActionButton[]
}

export const RundownLayouts = createMongoCollection<RundownLayoutBase, RundownLayoutBase>('rundownLayouts')
registerCollection('RundownLayouts', RundownLayouts)

// addIndex(RundownLayouts, {
// 	studioId: 1,
// 	collectionId: 1,
// 	objId: 1,
// 	mediaId: 1
// })
registerIndex(RundownLayouts, {
	showStyleBaseId: 1,
})
