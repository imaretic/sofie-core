import clsx from 'clsx'
import * as React from 'react'
import styles from '../TimelineZoomButton/TimelineZoomButton.module.scss'

export const TimelineZoomOutButton: React.FC<{
	className?: string
	disabled?: boolean
	title?: string
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ className, disabled, title, onClick }) => {
	return (
		<button className={clsx(styles.button, className)} onClick={onClick} disabled={disabled} title={title}>
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				role="presentation"
			>
				<circle cx="11.5" cy="11.5" r="7.5" fill="#5C5C5C" className={styles.background} />
				<rect x="6.5" y="10.5" width="10" height="2" fill="white" />
			</svg>
		</button>
	)
}
