import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/styles/base.scss'

import type { Preview } from '@storybook/react-vite'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'dark',
			values: [
				{ name: 'dark', value: '#1f1f1f' },
				{ name: 'light', value: '#ffffff' },
			],
		},
	},
}

export default preview
