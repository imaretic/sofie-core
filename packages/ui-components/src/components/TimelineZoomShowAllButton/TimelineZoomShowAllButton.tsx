import clsx from 'clsx'
import * as React from 'react'
import styles from '../TimelineZoomButton/TimelineZoomButton.module.scss'

export const TimelineZoomShowAllButton: React.FC<{
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
				<circle cx="11" cy="11" r="9" fill="#5C5C5C" className={styles.background} />
				<rect x="4.5" y="10" width="13" height="2" fill="white" />
				<path d="M8 6L4 11L8 16" stroke="white" />
				<path d="M14 16L18 11L14 6" stroke="white" />
			</svg>
		</button>
	)
}
