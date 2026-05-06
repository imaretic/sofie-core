import { useCallback, useState, type ChangeEvent, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleSwitchControl } from './ToggleSwitch.js'

function StatefulToggle(
	props: Omit<ComponentProps<typeof ToggleSwitchControl>, 'handleUpdate' | 'value'> & { initialValue?: boolean }
) {
	const { initialValue = false, ...rest } = props
	const [value, setValue] = useState(initialValue)
	const handleUpdate = useCallback((v: boolean, _e: ChangeEvent<HTMLInputElement>) => setValue(v), [])
	return <ToggleSwitchControl {...rest} value={value} handleUpdate={handleUpdate} />
}

const meta = {
	title: 'Components/ToggleSwitchControl',
	component: ToggleSwitchControl,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: { control: 'boolean' },
		label: { control: 'text' },
	},
	render: (args) => <StatefulToggle {...args} initialValue={args.value} />,
	args: {
		value: false,
		disabled: false,
	},
} satisfies Meta<typeof ToggleSwitchControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const On: Story = {
	args: {
		value: true,
	},
}

export const Disabled: Story = {
	args: {
		disabled: true,
		value: false,
	},
}

export const WithLabel: Story = {
	args: {
		label: 'Enable feature',
		value: false,
	},
}
