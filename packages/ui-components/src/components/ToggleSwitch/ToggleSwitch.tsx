import * as React from 'react'
import { useCallback, useRef } from 'react'
import { Form } from 'react-bootstrap'

export const ToggleSwitchControl: React.FC<{
	classNames?: string
	disabled?: boolean
	label?: string
	value: boolean
	handleUpdate: (value: boolean, e: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
	classNames,
	value,
	disabled,
	label,
	handleUpdate,
}) => {
	const currentValue = useRef(value)
	currentValue.current = value

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (disabled) return
			handleUpdate(!currentValue.current, e)
		},
		[handleUpdate, disabled]
	)

	return (
		<Form.Check
			type="switch"
			className={classNames}
			disabled={disabled}
			checked={value}
			onChange={handleChange}
			label={label}
		/>
	)
}
