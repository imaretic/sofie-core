import type { Meta, StoryObj } from '@storybook/react'
import { TimelineZoomInButton } from './TimelineZoomInButton.js'

const meta = {
	title: 'Components/TimelineZoomInButton',
	component: TimelineZoomInButton,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: { control: 'boolean' },
		title: { control: 'text' },
	},
	args: {
		disabled: false,
		title: 'Zoom In',
		onClick: () => undefined,
	},
} satisfies Meta<typeof TimelineZoomInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
	args: {
		disabled: true,
	},
}
