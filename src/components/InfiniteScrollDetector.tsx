import { useIntersection } from '@/hooks/useIntersection'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const InfiniteScrollDetectionBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 400px;
  pointer-events: none;
`

export const InfiniteScrollDetector: React.FC<{ onLoad?: () => unknown }> = ({ onLoad }) => {
	const ref = useRef<HTMLDivElement>(null)
	const entry = useIntersection(ref, { threshold: 0 })
	useEffect(() => {
		if (entry?.isIntersecting) onLoad?.()
	}, [entry?.isIntersecting, onLoad])
	return <InfiniteScrollDetectionBox ref={ref} />
}
