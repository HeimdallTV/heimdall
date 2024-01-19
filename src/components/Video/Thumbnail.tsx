import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

import { Flex } from 'lese'
import styled from 'styled-components'

import { formatNumberDuration } from '@libs/format'
import { when } from '@libs/utils'
import * as std from '@std'
import { Badge, BadgeProps } from '@mantine/core'

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

export type ThumbnailProps = PropsWithChildren<Pick<std.Video, 'staticThumbnail' | 'animatedThumbnail'>>
export const Thumbnail: React.FC<ThumbnailProps> = ({ staticThumbnail, animatedThumbnail, children }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [willShowAnimated, setWillShowAnimated] = useState(false)

  useEffect(() => {
    if (!isHovered) return
    if (!animatedThumbnail || animatedThumbnail.length === 0) return
    setWillShowAnimated(true)
  }, [isHovered, animatedThumbnail])

  return (
    <ThumbnailContext.Provider value={{ isHovered, willShowAnimated }}>
      <ThumbnailContainer
        relative
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={staticThumbnail[0].url} alt="thumbnail" />
        {animatedThumbnail !== undefined && (
          <img
            src={animatedThumbnail[0].url}
            alt="animated thumbnail"
            style={{
              opacity: willShowAnimated && isHovered ? 1 : 0,
              ...(isHovered ? { transition: TRANSITION } : {}),
            }}
          />
        )}
        {children}
      </ThumbnailContainer>
    </ThumbnailContext.Provider>
  )
}

export type LengthBadgeProps = Pick<std.Video, 'length' | 'type'>
export const LengthBadge: React.FC<LengthBadgeProps> = ({ type, length }) => {
  const { isHovered, willShowAnimated } = useContext(ThumbnailContext)
  const styles = {
    opacity: willShowAnimated && isHovered ? 0 : 1,
    transition: when(isHovered)(TRANSITION),
  }
  if (type !== std.VideoType.Static || length === undefined) return
  return (
    <AbsoluteBadge color="dark" styles={{ root: styles }}>
      {formatNumberDuration(length)}
    </AbsoluteBadge>
  )
}

export type VideoThumbnailProps = Partial<ThumbnailProps & LengthBadgeProps>
export const VideoThumbnail: React.FC<ThumbnailProps & LengthBadgeProps> = props => (
  <Thumbnail {...props}>
    <LengthBadge {...props} />
  </Thumbnail>
)
