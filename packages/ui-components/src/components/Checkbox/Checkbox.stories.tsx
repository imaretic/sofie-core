import { useCallback, useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CheckboxControl } from './Checkbox.js'

function StatefulCheckbox(
	props: Omit<ComponentProps<typeof CheckboxControl>, 'handleUpdate' | 'value'> & { initialValue?: boolean }
) {
	const { initialValue = false, ...rest } = props
	const [value, setValue] = useState(initialValue)
	const handleUpdate = useCallback((v: boolean) => setValue(v), [])
	return <CheckboxControl {...rest} value={value} handleUpdate={handleUpdate} />
}

const meta = {
	title: 'Components/CheckboxControl',
	component: CheckboxControl,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: { control: 'boolean' },
		title: { control: 'text' },
	},
	render: (args) => <StatefulCheckbox {...args} initialValue={args.value} />,
	args: {
		value: false,
		disabled: false,
	},
} satisfies Meta<typeof CheckboxControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
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

export const WithTitle: Story = {
	args: {
		title: 'Tooltip text',
		value: false,
	},
}
