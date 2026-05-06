import clsx from 'clsx'
import * as React from 'react'
import styles from './Spinner.module.scss'

export const Spinner: React.FC<{
	size?: 'large' | 'medium' | 'small'
	color?: 'blue' | 'white' | 'mint' | 'pink' | 'purple'
	className?: string
}> = ({ size = 'large', color = 'blue', className }) => {
	return (
		<div className={clsx(styles.wrapper, className)}>
			<div className={clsx(styles.spinner, styles[`color_${color}`], styles[`size_${size}`])}>
				<svg className={styles.spinnerSvg} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34">
					<circle className={styles.spinCircle} cx="17" cy="17" r="15"></circle>
				</svg>
			</div>
		</div>
	)
}
