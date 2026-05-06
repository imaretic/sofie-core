import type { Meta, StoryObj } from '@storybook/react'
import { TimelineZoomShowAllButton } from './TimelineZoomShowAllButton.js'

const meta = {
	title: 'Components/TimelineZoomShowAllButton',
	component: TimelineZoomShowAllButton,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: { control: 'boolean' },
		title: { control: 'text' },
	},
	args: {
		disabled: false,
		title: 'Show All',
		onClick: () => undefined,
	},
} satisfies Meta<typeof TimelineZoomShowAllButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
	args: {
		disabled: true,
	},
}
