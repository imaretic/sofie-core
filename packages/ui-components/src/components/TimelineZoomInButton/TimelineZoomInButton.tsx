import clsx from 'clsx'
import * as React from 'react'
import styles from '../TimelineZoomButton/TimelineZoomButton.module.scss'

export const TimelineZoomInButton: React.FC<{
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
				<circle cx="11" cy="11" r="11" fill="#5C5C5C" className={styles.background} />
				<rect x="12" y="5" width="12" height="2" transform="rotate(90 12 5)" fill="white" />
				<rect x="5" y="10" width="12" height="2" fill="white" />
			</svg>
		</button>
	)
}
