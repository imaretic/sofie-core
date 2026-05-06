import type { Meta, StoryObj } from '@storybook/react'
import { TimelineZoomOutButton } from './TimelineZoomOutButton.js'

const meta = {
	title: 'Components/TimelineZoomOutButton',
	component: TimelineZoomOutButton,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: { control: 'boolean' },
		title: { control: 'text' },
	},
	args: {
		disabled: false,
		title: 'Zoom Out',
		onClick: () => undefined,
	},
} satisfies Meta<typeof TimelineZoomOutButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
	args: {
		disabled: true,
	},
}
