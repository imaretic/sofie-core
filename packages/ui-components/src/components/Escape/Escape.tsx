import { useRef, useEffect, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import * as React from 'react'

/**
 * Creates DOM element to be used as React root.
 */
function createRootElement(id: string) {
	const rootContainer = document.createElement('div')
	rootContainer.setAttribute('id', id)
	return rootContainer
}

/**
 * Appends element as last child of body.
 */
function addRootElement(rootElem: HTMLElement) {
	document.body.appendChild(rootElem)
}

/**
 * Hook to create a React Portal.
 * Automatically handles creating and tearing-down the root elements (no SSR
 * makes this trivial), so there is no need to ensure the parent target already
 * exists.
 */
function usePortal(id: string, style?: Partial<Record<keyof React.CSSProperties, string>>) {
	const rootElemRef = useRef<HTMLElement | null>(null)

	useEffect(
		function setupElement() {
			const existingParent = document.querySelector<HTMLElement>(`#${id}`)
			const parentElem = existingParent || createRootElement(id)

			if (!existingParent) {
				addRootElement(parentElem)
			}

			if (rootElemRef.current) {
				parentElem.appendChild(rootElemRef.current)
			}

			return function removeElement() {
				rootElemRef.current?.remove()
				if (!parentElem.childElementCount) {
					parentElem.remove()
				}
			}
		},
		[id]
	)

	function getRootElem() {
		if (!rootElemRef.current) {
			const el = document.createElement('div')
			if (style) {
				for (const [prop, value] of Object.entries<string>(style)) {
					;(el.style as unknown as Record<string, string>)[prop] = value
				}
			}

			rootElemRef.current = el
		}
		return rootElemRef.current
	}

	return getRootElem()
}

export const Escape: React.FC<PropsWithChildren<{ to: 'viewport' | 'document' }>> = ({ to, children }) => {
	const portalContainer = usePortal(`escape-${to}`, {
		position: to === 'viewport' ? 'fixed' : 'absolute',
		left: '0',
		top: '0',
		right: '0',
		bottom: '0',
		zIndex: '10001',
		pointerEvents: 'none',
		overflow: 'visible',
	})

	return createPortal(children, portalContainer)
}
