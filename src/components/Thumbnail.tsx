import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'

import { Flex } from 'lese'
import styled from 'styled-components'

import { when } from '@libs/utils'
import type * as std from '@std'
import yt from '@yt'
import { Badge, type BadgeProps, type DefaultMantineColor, Skeleton } from '@mantine/core'

const TRANSITION = 'opacity 250ms ease 250ms'

const ThumbnailContainer = styled(Flex)`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    object-fit: cover;
    width: 100%;
    will-change: transform;
  }
`

const AbsoluteBadge = styled(Badge)<BadgeProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 4px;
`

const ThumbnailContext = createContext({
  isHovered: false,
  willShowAnimated: false,
})

export type ThumbnailProps = PropsWithChildren<
  Pick<std.Video, 'id' | 'staticThumbnail' | 'animatedThumbnail' | 'length' | 'viewedLength'>
>
export const Thumbnail: React.FC<ThumbnailProps> = ({
  id,
  staticThumbnail,
  animatedThumbnail,
  viewedLength,
  length,
  children,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [willShowAnimated, setWillShowAnimated] = useState(false)

  useEffect(() => {
    if (!isHovered) return
    if (!animatedThumbnail || animatedThumbnail.length === 0) return
    setWillShowAnimated(true)
  }, [isHovered, animatedThumbnail])

  const bestStaticThumbnail = staticThumbnail?.sort((a, b) => b.width - a.width)[0]
  const bestAnimatedThumbnail = animatedThumbnail?.sort((a, b) => b.width - a.width)[0]

  return (
    <ThumbnailContext.Provider value={{ isHovered, willShowAnimated }}>
      <ThumbnailContainer
        relative
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!loaded && (
          <Skeleton
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        <img src={bestStaticThumbnail?.url} alt="" onLoad={() => setLoaded(true)} />
        {bestAnimatedThumbnail !== undefined && (
          <img
            src={bestAnimatedThumbnail.url}
            alt="animated thumbnail"
            style={{
              opacity: willShowAnimated && isHovered ? 1 : 0,
              ...(isHovered ? { transition: TRANSITION } : {}),
            }}
          />
        )}
        {viewedLength !== undefined && length && length > 0 && (
          <ThumbnailWatched percent={(viewedLength / length) * 100} />
        )}
        {children}
      </ThumbnailContainer>
    </ThumbnailContext.Provider>
  )
}

const ThumbnailWatched = styled.div<{ percent: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--mantine-primary-color-5);
  transform-origin: left;
  transform: scaleX(${(_) => _.percent / 100});
  transition: transform 250ms ease;
`

export type ThumbnailBadgeProps = {
  text: string
  color?: DefaultMantineColor
} & Pick<BadgeProps, 'leftSection'>
export const ThumbnailBadge: React.FC<ThumbnailBadgeProps> = ({ text, color, leftSection }) => {
  const { isHovered, willShowAnimated } = useContext(ThumbnailContext)
  const styles = {
    opacity: willShowAnimated && isHovered ? 0 : 1,
    transition: when(isHovered)(TRANSITION),
  }
  return (
    <AbsoluteBadge color={color ?? 'dark'} leftSection={leftSection} styles={{ root: styles }}>
      {text}
    </AbsoluteBadge>
  )
}
