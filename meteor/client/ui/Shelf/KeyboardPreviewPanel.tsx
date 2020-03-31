import { Translated } from '../../lib/ReactMeteorData/ReactMeteorData'
import { translate } from 'react-i18next'
import * as React from 'react'
import { mousetrapHelper } from '../../lib/mousetrapHelper'
import { ShowStyleBase } from '../../../lib/collections/ShowStyleBases'
import { KeyboardPreview } from './KeyboardPreview'
import { Settings } from '../../../lib/Settings'
import { KeyboardLayouts } from '../../../lib/keyboardLayout'

interface IProps {
	visible?: boolean
	showStyleBase: ShowStyleBase
}

const _isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false

export const KeyboardPreviewPanel = translate()(class KeyboardPreviewPanel extends React.Component<Translated<IProps>> {
	constructor (props: Translated<IProps>) {
		super(props)
	}

	render () {
		if (this.props.visible) {
			return (
				<div className='adlib-panel super-dark adlib-panel--keyboard-preview'>
					<KeyboardPreview
						physicalLayout={KeyboardLayouts.nameToPhysicalLayout(Settings.keyboardMapLayout)}
						showStyleBase={this.props.showStyleBase}
					/>
				</div>
			)
		} else {
			return null
		}
	}
})