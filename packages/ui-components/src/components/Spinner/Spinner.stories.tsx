import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner.js'

const meta = {
	title: 'Components/Spinner',
	component: Spinner,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		size: {
			control: 'select',
			options: ['small', 'medium', 'large'],
		},
		color: {
			control: 'select',
			options: ['blue', 'white', 'mint', 'pink', 'purple'],
		},
	},
	args: {
		size: 'large',
		color: 'blue',
	},
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallMint: Story = {
	args: {
		size: 'small',
		color: 'mint',
	},
}

export const LargePurple: Story = {
	args: {
		size: 'large',
		color: 'purple',
	},
}
