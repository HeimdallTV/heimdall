import styled from '@emotion/styled'
import { TextSecondary } from './Typography'
import { SeparationProps, separationProp } from 'lese'

const PaperButtonStyled = styled(TextSecondary)`
  display: inline-block;
  cursor: pointer;
`

export const PaperButton = (props: Parameters<typeof PaperButtonStyled>[0]) => (
  <PaperButtonStyled medium align upperCase fontSize="1.2rem" lineHeight="1.8rem" {...props} />
)

export const Button = styled('button')<
  {
    filled?: boolean
    tonal?: boolean
    size: 'medium'
    segmentEnd?: boolean
    segmentStart?: boolean
  } & SeparationProps
>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  box-sizing: border-box;
  cursor: pointer;

  ${separationProp}

  ${({ size }) =>
    size === 'medium' &&
    `
    padding: 0 16px;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    border-radius: 18px;
  `}

  outline: none;
  border: none;
  margin: none;

  ${({ filled }) =>
    filled &&
    `
    color: var(--bg-500);
    background-color: var(--text-primary);

    :hover {
      opacity: 0.8;
    }
  `}

  ${({ tonal }) =>
    tonal &&
    `
    color: var(--text-primary);
    background-color: var(--bg-800);

    :hover {
      background-color: var(--bg-900);
    }
  `}

  ${({ segmentStart }) =>
    segmentStart &&
    `
    border-radius: 18px 0 0 18px;
  `}
  ${({ segmentEnd }) =>
    segmentEnd &&
    `
    border-radius: 0 18px 18px 0;
  `}
`
