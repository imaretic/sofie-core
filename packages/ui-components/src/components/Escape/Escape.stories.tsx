import type { Meta, StoryObj } from '@storybook/react'
import { Escape } from './Escape.js'

const meta = {
	title: 'Components/Escape',
	component: Escape,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		to: {
			control: 'select',
			options: ['viewport', 'document'],
		},
	},
	args: {
		to: 'viewport',
	},
} satisfies Meta<typeof Escape>

export default meta
type Story = StoryObj<typeof meta>

function DemoPanel() {
	return (
		<div
			style={{
				position: 'absolute',
				left: 24,
				top: 24,
				padding: '12px 16px',
				background: '#2f86e6',
				color: '#fff',
				borderRadius: 8,
				pointerEvents: 'auto',
			}}
		>
			Content rendered through Escape portal
		</div>
	)
}

export const Viewport: Story = {
	args: {
		to: 'viewport',
		children: <DemoPanel />,
	},
}

export const Document: Story = {
	args: {
		to: 'document',
		children: <DemoPanel />,
	},
}
