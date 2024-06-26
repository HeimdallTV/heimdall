// https://usehooks-ts.com/react-hook/use-intersection-observer
import { type RefObject, useEffect, useState } from 'react'

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersection(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = Boolean(window.IntersectionObserver)

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry
}
