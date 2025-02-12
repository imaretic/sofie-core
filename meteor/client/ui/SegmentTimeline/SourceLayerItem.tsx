import * as React from 'react'
import * as _ from 'underscore'
import { ISourceLayerUi, IOutputLayerUi, PartUi, PieceUi } from './SegmentTimelineContainer'
import { SourceLayerType, PieceLifespan, PieceTransitionType } from '@sofie-automation/blueprints-integration'
import { RundownUtils } from '../../lib/rundown'
import ClassNames from 'classnames'
import { DefaultLayerItemRenderer } from './Renderers/DefaultLayerItemRenderer'
import { MicSourceRenderer } from './Renderers/MicSourceRenderer'
import { VTSourceRenderer } from './Renderers/VTSourceRenderer'
import { STKSourceRenderer } from './Renderers/STKSourceRenderer'
import { L3rdSourceRenderer } from './Renderers/L3rdSourceRenderer'
import { SplitsSourceRenderer } from './Renderers/SplitsSourceRenderer'
import { TransitionSourceRenderer } from './Renderers/TransitionSourceRenderer'
import { LocalLayerItemRenderer } from './Renderers/LocalLayerItemRenderer'

import { DEBUG_MODE } from './SegmentTimelineDebugMode'
import { withTranslation, WithTranslation } from 'react-i18next'
import { getElementDocumentOffset, OffsetPosition } from '../../utils/positions'
import { unprotectString } from '../../../lib/lib'
import RundownViewEventBus, { RundownViewEvents, HighlightEvent } from '../RundownView/RundownViewEventBus'
import { Studio } from '../../../lib/collections/Studios'
import { pieceUiClassNames } from '../../lib/ui/pieceUiClassNames'

const LEFT_RIGHT_ANCHOR_SPACER = 15
const MARGINAL_ANCHORED_WIDTH = 5

export interface ISourceLayerItemProps {
	layer: ISourceLayerUi
	outputLayer: IOutputLayerUi
	mediaPreviewUrl: string
	// segment: SegmentUi
	part: PartUi
	partStartsAt: number
	partDuration: number
	partExpectedDuration: number
	piece: PieceUi
	timeScale: number
	isLiveLine: boolean
	isNextLine: boolean
	isPreview: boolean
	isTooSmallForText: boolean
	onFollowLiveLine?: (state: boolean, event: any) => void
	onClick?: (piece: PieceUi, e: React.MouseEvent<HTMLDivElement>) => void
	onDoubleClick?: (item: PieceUi, e: React.MouseEvent<HTMLDivElement>) => void
	relative?: boolean
	followLiveLine: boolean
	autoNextPart: boolean
	liveLineHistorySize: number
	livePosition: number | null
	outputGroupCollapsed: boolean
	scrollLeft: number
	scrollWidth: number
	liveLinePadding: number
	layerIndex: number
	studio: Studio | undefined
}
interface ISourceLayerItemState {
	showMiniInspector: boolean
	elementPosition: OffsetPosition
	cursorPosition: OffsetPosition
	scrollLeftOffset: number
	cursorTimePosition: number
	itemElement: HTMLDivElement | null
	leftAnchoredWidth: number
	rightAnchoredWidth: number
	highlight: boolean
}
export const SourceLayerItem = withTranslation()(
	class SourceLayerItem extends React.Component<ISourceLayerItemProps & WithTranslation, ISourceLayerItemState> {
		private _resizeObserver: ResizeObserver | undefined
		private itemElement: HTMLDivElement | undefined

		constructor(props) {
			super(props)
			this.state = {
				showMiniInspector: false,
				elementPosition: {
					top: 0,
					left: 0,
				},
				cursorPosition: {
					top: 0,
					left: 0,
				},
				scrollLeftOffset: 0,
				cursorTimePosition: 0,
				itemElement: null,
				leftAnchoredWidth: 0,
				rightAnchoredWidth: 0,
				highlight: false,
			}
		}

		setRef = (e: HTMLDivElement) => {
			this.setState({
				itemElement: e,
			})
			this.itemElement = e
		}

		convertTimeToPixels = (time: number) => {
			return Math.round(this.props.timeScale * time)
		}

		getItemLabelOffsetLeft = (): React.CSSProperties => {
			if (this.props.relative) return {}
			const maxLabelWidth = this.props.piece.maxLabelWidth

			if (this.props.part && this.props.partStartsAt !== undefined) {
				//  && this.props.piece.renderedInPoint !== undefined && this.props.piece.renderedDuration !== undefined
				const piece = this.props.piece

				const inPoint = piece.renderedInPoint || 0
				const duration = Number.isFinite(piece.renderedDuration || 0)
					? piece.renderedDuration || this.props.partDuration || this.props.part.renderedDuration || 0
					: this.props.partDuration || this.props.part.renderedDuration || 0

				const elementWidth = this.getElementAbsoluteWidth()

				const widthConstrictedMode =
					this.props.isTooSmallForText ||
					(this.state.leftAnchoredWidth > 0 &&
						this.state.rightAnchoredWidth > 0 &&
						this.state.leftAnchoredWidth + this.state.rightAnchoredWidth > elementWidth)

				const nextIsTouching = !!piece.cropped

				if (this.props.followLiveLine && this.props.isLiveLine) {
					const liveLineHistoryWithMargin = this.props.liveLineHistorySize - 10
					if (
						this.props.scrollLeft + liveLineHistoryWithMargin / this.props.timeScale >
							inPoint + this.props.partStartsAt + this.state.leftAnchoredWidth / this.props.timeScale &&
						this.props.scrollLeft + liveLineHistoryWithMargin / this.props.timeScale <
							inPoint + duration + this.props.partStartsAt
					) {
						const targetPos = this.convertTimeToPixels(this.props.scrollLeft - inPoint - this.props.partStartsAt)

						return {
							maxWidth:
								this.state.rightAnchoredWidth > 0
									? (elementWidth - this.state.rightAnchoredWidth).toString() + 'px'
									: maxLabelWidth !== undefined
									? this.convertTimeToPixels(maxLabelWidth).toString() + 'px'
									: nextIsTouching
									? '100%'
									: 'none',
							transform:
								'translate(' +
								Math.floor(
									widthConstrictedMode
										? targetPos
										: Math.min(targetPos, elementWidth - this.state.rightAnchoredWidth - liveLineHistoryWithMargin - 10)
								).toString() +
								'px, 0) ' +
								'translate(' +
								Math.floor(liveLineHistoryWithMargin).toString() +
								'px, 0) ' +
								'translate(-100%, 0)',
						}
					} else if (
						this.state.rightAnchoredWidth < elementWidth &&
						this.state.leftAnchoredWidth < elementWidth &&
						this.props.scrollLeft + liveLineHistoryWithMargin / this.props.timeScale >=
							inPoint + duration + this.props.partStartsAt
					) {
						const targetPos = this.convertTimeToPixels(this.props.scrollLeft - inPoint - this.props.partStartsAt)

						return {
							maxWidth:
								this.state.rightAnchoredWidth > 0
									? (elementWidth - this.state.rightAnchoredWidth).toString() + 'px'
									: maxLabelWidth !== undefined
									? this.convertTimeToPixels(maxLabelWidth).toString() + 'px'
									: nextIsTouching
									? '100%'
									: 'none',
							transform:
								'translate(' +
								Math.floor(
									Math.min(targetPos, elementWidth - this.state.rightAnchoredWidth - liveLineHistoryWithMargin - 10)
								).toString() +
								'px, 0) ' +
								'translate(' +
								Math.floor(liveLineHistoryWithMargin).toString() +
								'px, 0) ' +
								'translate3d(-100%, 0)',
						}
					} else {
						return {
							maxWidth:
								this.state.rightAnchoredWidth > 0
									? (elementWidth - this.state.rightAnchoredWidth - 10).toString() + 'px'
									: maxLabelWidth !== undefined
									? this.convertTimeToPixels(maxLabelWidth).toString() + 'px'
									: nextIsTouching
									? '100%'
									: 'none',
						}
					}
				} else {
					if (
						this.props.scrollLeft > inPoint + this.props.partStartsAt &&
						this.props.scrollLeft < inPoint + duration + this.props.partStartsAt
					) {
						const targetPos = this.convertTimeToPixels(this.props.scrollLeft - inPoint - this.props.partStartsAt)

						return {
							maxWidth:
								this.state.rightAnchoredWidth > 0
									? (elementWidth - this.state.rightAnchoredWidth - 10).toString() + 'px'
									: maxLabelWidth !== undefined
									? this.convertTimeToPixels(maxLabelWidth).toString() + 'px'
									: nextIsTouching
									? '100%'
									: 'none',
							transform:
								'translate(' +
								Math.floor(
									widthConstrictedMode || this.state.leftAnchoredWidth === 0 || this.state.rightAnchoredWidth === 0
										? targetPos
										: Math.min(targetPos, elementWidth - this.state.leftAnchoredWidth - this.state.rightAnchoredWidth)
								).toString() +
								'px,  0)',
						}
					} else {
						return {
							maxWidth:
								this.state.rightAnchoredWidth > 0
									? (elementWidth - this.state.rightAnchoredWidth - 10).toString() + 'px'
									: maxLabelWidth !== undefined
									? this.convertTimeToPixels(maxLabelWidth).toString() + 'px'
									: nextIsTouching
									? '100%'
									: 'none',
						}
					}
				}
			}
			return {}
		}

		getItemLabelOffsetRight = (): React.CSSProperties => {
			if (this.props.relative) return {}

			if (!this.props.part || this.props.partStartsAt === undefined) return {}

			const piece = this.props.piece
			const innerPiece = piece.instance.piece

			const inPoint = piece.renderedInPoint || 0
			const duration =
				innerPiece.lifespan !== PieceLifespan.WithinPart || piece.renderedDuration === 0
					? this.props.partDuration - inPoint
					: Math.min(piece.renderedDuration || 0, this.props.partDuration - inPoint)
			const outPoint = inPoint + duration

			const elementWidth = this.getElementAbsoluteWidth()

			// const widthConstrictedMode = this.state.leftAnchoredWidth > 0 && this.state.rightAnchoredWidth > 0 && ((this.state.leftAnchoredWidth + this.state.rightAnchoredWidth) > this.state.elementWidth)

			if (
				this.props.scrollLeft + this.props.scrollWidth < outPoint + this.props.partStartsAt &&
				this.props.scrollLeft + this.props.scrollWidth > inPoint + this.props.partStartsAt
			) {
				const targetPos = Math.max(
					(this.props.scrollLeft + this.props.scrollWidth - outPoint - this.props.partStartsAt) * this.props.timeScale,
					(elementWidth - this.state.leftAnchoredWidth - this.state.rightAnchoredWidth - LEFT_RIGHT_ANCHOR_SPACER) * -1
				)

				return {
					transform: 'translate(' + Math.floor(targetPos).toString() + 'px,  0)',
				}
			}
			return {}
		}

		getItemDuration = (returnInfinite?: boolean): number => {
			const piece = this.props.piece
			const innerPiece = piece.instance.piece

			const expectedDurationNumber =
				typeof innerPiece.enable.duration === 'number' ? innerPiece.enable.duration || 0 : 0

			let itemDuration: number
			if (!returnInfinite) {
				itemDuration = Math.min(
					piece.renderedDuration || expectedDurationNumber || 0,
					this.props.partDuration - (piece.renderedInPoint || 0)
				)
			} else {
				itemDuration =
					this.props.partDuration - (piece.renderedInPoint || 0) <
					(piece.renderedDuration || expectedDurationNumber || 0)
						? Number.POSITIVE_INFINITY
						: piece.renderedDuration || expectedDurationNumber || 0
			}

			if (
				(innerPiece.lifespan !== PieceLifespan.WithinPart ||
					(innerPiece.enable.start !== undefined && innerPiece.enable.duration === undefined)) &&
				!piece.cropped &&
				piece.renderedDuration === null &&
				piece.instance.userDuration === undefined
			) {
				if (!returnInfinite) {
					itemDuration = this.props.partDuration - (piece.renderedInPoint || 0)
				} else {
					itemDuration = Number.POSITIVE_INFINITY
				}
			}

			return itemDuration
		}

		getElementAbsoluteWidth(): number {
			const itemDuration = this.getItemDuration()
			return this.convertTimeToPixels(itemDuration)
		}

		getItemStyle(): { [key: string]: string } {
			const piece = this.props.piece

			// If this is a live line, take duration verbatim from SegmentLayerItemContainer with a fallback on expectedDuration.
			// If not, as-run part "duration" limits renderdDuration which takes priority over MOS-import
			// expectedDuration (editorial duration)

			// let liveLinePadding = this.props.autoNextPart ? 0 : (this.props.isLiveLine ? this.props.liveLinePadding : 0)

			if (this.props.relative) {
				const itemDuration = this.getItemDuration()
				return {
					// also: don't render transitions in relative mode
					left: (((piece.renderedInPoint || 0) / (this.props.partDuration || 1)) * 100).toString() + '%',
					width: ((itemDuration / (this.props.partDuration || 1)) * 100).toString() + '%',
				}
			} else {
				return {
					left: this.convertTimeToPixels(piece.renderedInPoint || 0).toString() + 'px',
					width: this.getElementAbsoluteWidth().toString() + 'px',
				}
			}
		}

		// TODO(Performance): use ResizeObserver to avoid style recalculations
		// checkElementWidth = () => {
		// 	if (this.state.itemElement && this._forceSizingRecheck) {
		// 		this._forceSizingRecheck = false
		// 		const width = getElementWidth(this.state.itemElement) || 0
		// 		if (this.state.elementWidth !== width) {
		// 			this.setState({
		// 				elementWidth: width
		// 			})
		// 		}
		// 	}
		// }

		private highlightTimeout: NodeJS.Timer

		private onHighlight = (e: HighlightEvent) => {
			if (e.partId === this.props.part.partId && e.pieceId === this.props.piece.instance.piece._id) {
				this.setState({
					highlight: true,
				})
				clearTimeout(this.highlightTimeout)
				this.highlightTimeout = setTimeout(() => {
					this.setState({
						highlight: false,
					})
				}, 5000)
			}
		}

		componentDidMount() {
			RundownViewEventBus.on(RundownViewEvents.HIGHLIGHT, this.onHighlight)
		}

		componentWillUnmount() {
			super.componentWillUnmount && super.componentWillUnmount()
			RundownViewEventBus.off(RundownViewEvents.HIGHLIGHT, this.onHighlight)
			clearTimeout(this.highlightTimeout)
		}

		componentDidUpdate(prevProps: ISourceLayerItemProps, _prevState: ISourceLayerItemState) {
			if (prevProps.scrollLeft !== this.props.scrollLeft && this.state.showMiniInspector) {
				const scrollLeftOffset = this.state.scrollLeftOffset + (this.props.scrollLeft - prevProps.scrollLeft)
				const cursorTimePosition = this.state.cursorTimePosition + (this.props.scrollLeft - prevProps.scrollLeft)
				if (this.state.scrollLeftOffset !== scrollLeftOffset && this.state.cursorTimePosition !== cursorTimePosition) {
					this.setState({
						scrollLeftOffset,
						cursorTimePosition,
					})
				}
			}
		}

		itemClick = (e: React.MouseEvent<HTMLDivElement>) => {
			// this.props.onFollowLiveLine && this.props.onFollowLiveLine(false, e)
			e.preventDefault()
			e.stopPropagation()
			this.props.onClick && this.props.onClick(this.props.piece, e)
		}

		itemDblClick = (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault()
			e.stopPropagation()

			if (typeof this.props.onDoubleClick === 'function') {
				this.props.onDoubleClick(this.props.piece, e)
			}
		}

		itemMouseUp = (e: any) => {
			const eM = e as MouseEvent
			if (eM.ctrlKey === true) {
				eM.preventDefault()
				eM.stopPropagation()
			}
			return
		}

		toggleMiniInspectorOn = (e: React.MouseEvent) => this.toggleMiniInspector(e, true)
		toggleMiniInspectorOff = (e: React.MouseEvent) => this.toggleMiniInspector(e, false)

		toggleMiniInspector = (e: MouseEvent | any, v: boolean) => {
			this.setState({
				showMiniInspector: v,
			})
			const elementPos = getElementDocumentOffset(this.state.itemElement) || {
				top: 0,
				left: 0,
			}

			const cursorPosition = {
				left: e.clientX - elementPos.left,
				top: e.clientY - elementPos.top,
			}

			const cursorTimePosition = Math.max(cursorPosition.left, 0) / this.props.timeScale

			this.setState({
				scrollLeftOffset: 0,
				elementPosition: elementPos,
				cursorPosition,
				cursorTimePosition,
			})
		}

		moveMiniInspector = (e: MouseEvent | any) => {
			const cursorPosition = {
				left: e.clientX - this.state.elementPosition.left,
				top: e.clientY - this.state.elementPosition.top,
			}
			const cursorTimePosition = Math.max(cursorPosition.left, 0) / this.props.timeScale + this.state.scrollLeftOffset

			this.setState({
				cursorPosition: _.extend(this.state.cursorPosition, cursorPosition),
				cursorTimePosition,
			})
		}

		setAnchoredElsWidths = (leftAnchoredWidth: number, rightAnchoredWidth: number) => {
			// anchored labels will sometimes errorneously report some width. Discard if it's marginal.
			this.setState({
				leftAnchoredWidth: leftAnchoredWidth > MARGINAL_ANCHORED_WIDTH ? leftAnchoredWidth : 0,
				rightAnchoredWidth: rightAnchoredWidth > MARGINAL_ANCHORED_WIDTH ? rightAnchoredWidth : 0,
			})
		}

		renderInsideItem(typeClass: string) {
			switch (this.props.layer.type) {
				case SourceLayerType.SCRIPT:
					// case SourceLayerType.MIC:
					return (
						<MicSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				case SourceLayerType.VT:
					return (
						<VTSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				case SourceLayerType.GRAPHICS:
				case SourceLayerType.LOWER_THIRD:
					return (
						<L3rdSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				case SourceLayerType.SPLITS:
					return (
						<SplitsSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				case SourceLayerType.LIVE_SPEAK:
					// @ts-ignore: intrinsics get lost because of the complicated class structure, this is fine
					return (
						<STKSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							// @ts-ignore: intrinsics get lost because of the complicated class structure, this is fine
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
							studio={this.props.studio}
						/>
					)

				case SourceLayerType.TRANSITION:
					return (
						<TransitionSourceRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				case SourceLayerType.LOCAL:
					return (
						<LocalLayerItemRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
				default:
					return (
						<DefaultLayerItemRenderer
							key={unprotectString(this.props.piece.instance._id)}
							typeClass={typeClass}
							getItemDuration={this.getItemDuration}
							getItemLabelOffsetLeft={this.getItemLabelOffsetLeft}
							getItemLabelOffsetRight={this.getItemLabelOffsetRight}
							setAnchoredElsWidths={this.setAnchoredElsWidths}
							{...this.props}
							{...this.state}
						/>
					)
			}
		}

		isInsideViewport() {
			if (this.props.relative) {
				return true
			} else {
				return RundownUtils.isInsideViewport(
					this.props.scrollLeft,
					this.props.scrollWidth,
					this.props.part,
					this.props.partStartsAt,
					this.props.partDuration,
					this.props.piece
				)
			}
		}

		render() {
			if (this.isInsideViewport()) {
				const typeClass = RundownUtils.getSourceLayerClassName(this.props.layer.type)

				const piece = this.props.piece
				const innerPiece = piece.instance.piece

				const elementWidth = this.getElementAbsoluteWidth()

				return (
					<div
						className={pieceUiClassNames(
							piece,
							'segment-timeline__piece',
							this.props.layer.type,
							this.props.part.partId,
							this.state.highlight,
							this.props.relative,
							elementWidth,
							this.state
						)}
						data-obj-id={piece.instance._id}
						ref={this.setRef}
						onClick={this.itemClick}
						onDoubleClick={this.itemDblClick}
						onMouseUp={this.itemMouseUp}
						onMouseMove={this.moveMiniInspector}
						onMouseEnter={this.toggleMiniInspectorOn}
						onMouseLeave={this.toggleMiniInspectorOff}
						style={this.getItemStyle()}
					>
						{this.renderInsideItem(typeClass)}
						{DEBUG_MODE && (
							<div className="segment-timeline__debug-info">
								{innerPiece.enable.start} / {RundownUtils.formatTimeToTimecode(this.props.partDuration).substr(-5)} /{' '}
								{piece.renderedDuration ? RundownUtils.formatTimeToTimecode(piece.renderedDuration).substr(-5) : 'X'} /{' '}
								{typeof innerPiece.enable.duration === 'number'
									? RundownUtils.formatTimeToTimecode(innerPiece.enable.duration).substr(-5)
									: ''}
							</div>
						)}
						{innerPiece.transitions &&
						innerPiece.transitions.inTransition &&
						(innerPiece.transitions.inTransition.duration || 0) > 0 ? (
							<div
								className={ClassNames('segment-timeline__piece__transition', 'in', {
									mix: innerPiece.transitions.inTransition.type === PieceTransitionType.MIX,
									wipe: innerPiece.transitions.inTransition.type === PieceTransitionType.WIPE,
								})}
								style={{
									width: this.convertTimeToPixels(innerPiece.transitions.inTransition.duration || 0).toString() + 'px',
								}}
							/>
						) : null}
						{innerPiece.transitions &&
						innerPiece.transitions.outTransition &&
						(innerPiece.transitions.outTransition.duration || 0) > 0 ? (
							<div
								className={ClassNames('segment-timeline__piece__transition', 'out', {
									mix: innerPiece.transitions.outTransition.type === PieceTransitionType.MIX,
									wipe: innerPiece.transitions.outTransition.type === PieceTransitionType.WIPE,
								})}
								style={{
									width: this.convertTimeToPixels(innerPiece.transitions.outTransition.duration || 0).toString() + 'px',
								}}
							/>
						) : null}
					</div>
				)
			} else {
				// render a placeholder
				return (
					<div
						className="segment-timeline__piece"
						data-obj-id={this.props.piece.instance._id}
						ref={this.setRef}
						style={this.getItemStyle()}
					></div>
				)
			}
		}
	}
)
