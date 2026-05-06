import * as React from 'react'
import { useCallback } from 'react'
import { Form } from 'react-bootstrap'

export const CheckboxControl: React.FC<{
	classNames?: string
	disabled?: boolean
	title?: string
	value: boolean
	handleUpdate: (value: boolean) => void
}> = ({
	classNames,
	value,
	disabled,
	handleUpdate,
	title,
}) => {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleUpdate(!!e.currentTarget.checked)
		},
		[handleUpdate]
	)

	return (
		<Form.Check
			type="checkbox"
			className={classNames}
			checked={value}
			onChange={handleChange}
			disabled={disabled}
			title={title}
		/>
	)
}
