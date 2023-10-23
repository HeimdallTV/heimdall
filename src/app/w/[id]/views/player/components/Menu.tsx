import {
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';

import { Grid } from 'lese';
import styled from 'styled-components';

import { CheckRounded } from '@mui/icons-material';

const FloatingMenuContainerStyled = styled.div<{ visible: boolean }>`
  position: relative;

  .menu {
    ${props => (props.visible ? '' : 'display: none;')}
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
  }
`

export const FloatingMenuContainer: React.FC<
  PropsWithChildren<{ visible: boolean; setVisible: React.Dispatch<React.SetStateAction<boolean>> }>
> = ({ children, visible, setVisible }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!visible) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  })
  useEffect(() => {
    if (!visible) return
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return
      setVisible(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  })

  return (
    <FloatingMenuContainerStyled ref={ref} visible={visible}>
      {children}
    </FloatingMenuContainerStyled>
  )
}

export const Menu = styled.div<{ background?: string }>`
  display: flex;
  flex-direction: column;
  padding: 8px 0px;
  border-radius: 4px;
  background: ${props => props.background ?? 'var(--bg-700)'};
  width: 200px;
`
Menu.defaultProps = { className: 'menu' }

type MenuListItemProps = PropsWithChildren<
  Partial<{
    background: string
    hoverBackground: string
    selected: boolean
    onClick: React.MouseEventHandler<HTMLDivElement>
  }>
>
const MenuListItemStyled = styled(Grid)<Omit<MenuListItemProps, 'selected'>>`
  background: ${props => props.background ?? 'var(--bg-700)'};
  &:hover {
    background: ${props => props.hoverBackground ?? 'var(--bg-800)'};
  }
  padding: 8px 16px;
  cursor: pointer;
`

export const MenuListItem: React.FC<Partial<MenuListItemProps>> = ({
  background,
  hoverBackground,
  selected,
  onClick,
  children,
}) => {
  return (
    <MenuListItemStyled
      background={background}
      hoverBackground={hoverBackground}
      columns="16px 1fr"
      gap="8px"
      yAlign
      onClick={onClick}
    >
      {selected ? <CheckRounded fontSize="small" /> : <div />}
      {children}
    </MenuListItemStyled>
  )
}
