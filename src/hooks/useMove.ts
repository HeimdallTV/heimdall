import { useEffect, useState } from 'react'

export type MoveCallbackMetadata = {
	elem: HTMLElement
	isDragging: boolean
	isHovering: boolean
}
export const useMove = (
	onMove: (value: number, metadata: MoveCallbackMetadata) => void,
	onUp: (value: number, metadata: MoveCallbackMetadata) => void,
	onBlur: (value: number, metadata: MoveCallbackMetadata) => void,
) => {
	const [elem, setElem] = useState<HTMLDivElement | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	useEffect(() => {
		if (!elem) return

		const calculatePercent = (x: number) => {
			const { left, width } = elem.getBoundingClientRect()
			return Math.min(100, Math.max(0, ((x - left) / width) * 100))
		}

		const getHovering = (e: MouseEvent) => elem.contains(document.elementFromPoint(e.clientX, e.clientY))
		const onMouseMove = (e: MouseEvent) => {
			e.preventDefault()
			onMove(calculatePercent(e.clientX), {
				elem,
				isDragging,
				isHovering: getHovering(e),
			})
		}

		const onMouseBlur = (e: MouseEvent) => {
			e.preventDefault()
			onBlur(calculatePercent(e.clientX), {
				elem,
				isDragging,
				isHovering: getHovering(e),
			})
		}

		const onMouseUp = (e: MouseEvent) => {
			e.preventDefault()
			window.removeEventListener('mousemove', onMouseMove, true)
			document.documentElement.removeEventListener('mouseleave', onMouseUp)

			setIsDragging(false)
			onUp(calculatePercent(e.clientX), { elem, isDragging, isHovering: getHovering(e) })
		}

		const onMouseDown = (e: MouseEvent) => {
			e.preventDefault()
			window.addEventListener('mousemove', onMouseMove, true)
			document.documentElement.addEventListener('mouseleave', onMouseUp)
			elem.addEventListener('mouseup', onMouseUp)

			setIsDragging(true)
			onMove(calculatePercent(e.clientX), { elem, isDragging, isHovering: getHovering(e) })
		}
		elem.addEventListener('mousedown', onMouseDown)
		elem.addEventListener('mousemove', onMouseMove)
		elem.addEventListener('mouseleave', onMouseBlur)
		if (isDragging) elem.addEventListener('mouseup', onMouseUp)

		return () => {
			elem.removeEventListener('mouseup', onMouseUp)
			elem.removeEventListener('mousedown', onMouseDown)
			elem.removeEventListener('mousemove', onMouseMove)
			elem.removeEventListener('mouseleave', onMouseBlur)
			document.documentElement.removeEventListener('mouseleave', onMouseUp)
		}
	}, [elem, onMove, onUp, onBlur, isDragging])

	return (elem: HTMLDivElement) => setElem(elem)
}
