import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Flex } from 'lese';
import styled from 'styled-components';

import { formatNumberDuration } from '@libs/format';
import { when } from '@libs/utils';
import * as std from '@std';

const TRANSITION = 'opacity 250ms ease 250ms'

const ThumbnailContainer = styled(Flex)`
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  &::before {
    display: block;
    content: '';
    width: 100%;
    padding-top: 56.25%;
    background-color: var(--bg-700);
  }

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

const Badge = styled('div')<{ background?: string; color?: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 4px;
  /* FIXME: Should have dd transparency */
  background-color: ${({ background }) => background ?? 'var(--bg-200)'};
  color: ${({ color }) => color ?? 'var(--text-primary)'};
  padding: 3px 4px;
  border-radius: 2px;
  font-weight: 500;
  font-size: 1.2rem;
`

const ThumbnailContext = createContext({
  isHovered: false,
  willShowAnimated: false,
})

export type ThumbnailProps = PropsWithChildren<Pick<std.Video, 'staticThumbnail' | 'animatedThumbnail'>>
export const Thumbnail: React.FC<ThumbnailProps> = ({ staticThumbnail, animatedThumbnail, children }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [willShowAnimated, setWillShowAnimated] = useState(false)
  console.log(willShowAnimated)

  useEffect(() => {
    if (!isHovered) return
    if (!animatedThumbnail || animatedThumbnail.length === 0) return
    setWillShowAnimated(true)

    // const controller = new AbortController()
    // fetch(animatedThumbnail[0].url, { signal: controller.signal }).then(res => {
    //   console.log(res.status, res.ok)
    //   setWillShowAnimated(res.ok)
    // })
    // return () => controller.abort()
  }, [isHovered, animatedThumbnail])

  return (
    <ThumbnailContext.Provider value={{ isHovered, willShowAnimated }}>
      <ThumbnailContainer
        relative
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={staticThumbnail[0].url} />
        <img
          src={animatedThumbnail?.[0].url}
          style={{
            opacity: willShowAnimated && isHovered ? 1 : 0,
            ...(isHovered ? { transition: TRANSITION } : {}),
          }}
        />
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
  const shouldShow = type === std.VideoType.Static && length !== undefined
  return <>{shouldShow && <Badge style={styles}>{formatNumberDuration(length)}</Badge>}</>
}

export type VideoThumbnailProps = ThumbnailProps & LengthBadgeProps
export const VideoThumbnail: React.FC<ThumbnailProps & LengthBadgeProps> = props => (
  <Thumbnail {...props}>
    <LengthBadge {...props} />
  </Thumbnail>
)
