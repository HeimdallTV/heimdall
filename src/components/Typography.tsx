import styled from '@emotion/styled'
import { propertyGenerator } from 'lese'

type TextProps = PropsWithChildren<{
  color?: string
  fontSize?: string

  bold?: boolean
  semiBold?: boolean
  medium?: boolean
  regular?: boolean

  lineHeight?: string
  fixedWidthNumbers?: boolean

  align?: boolean | string // TODO: How to get type of style attribute?

  upperCase?: boolean
  capitalize?: boolean

  lineClamp?: number
}>

// TODO: Set lineHeight equal to fontSize?
const TextPropertyGenerator = propertyGenerator<TextProps>([
  ['color', { property: 'color' }],
  ['fontSize', { property: 'font-size' }],
  ['bold', () => 'font-weight: 700'],
  ['semiBold', () => 'font-weight: 600'],
  ['medium', () => 'font-weight: 500'],
  ['regular', () => 'font-weight: 400'],
  ['lineHeight', { property: 'line-height' }],
  ['fixedWidthNumbers', () => 'font-variant-numeric: tabular-nums'],
  // FIXME: Lese bug with { default: 'center', property: 'text-align' }?
  // ['align', { default: 'center', property: 'text-align' }],
  ['align', ({ align }) => `text-align: ${align === true ? 'center' : align}`],
  ['upperCase', () => 'text-transform: uppercase'],
  ['capitalize', () => 'text-transform: capitalize'],
  [
    'lineClamp',
    // Truly incredible piece of engineering
    // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
    ({ lineClamp }) =>
      `-webkit-line-clamp: ${lineClamp};
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;`,
  ],
])

export const Text = styled('span')<TextProps>`
  color: ${({ color }) => color ?? 'var(--text-primary)'};
  ${TextPropertyGenerator}
`

export const TextPrimary = styled(Text)`
  color: var(--text-primary);
`

export const TextSecondary = styled(Text)`
  color: var(--text-secondary);
`

export const TextTertiary = styled(Text)`
  color: var(--text-tertiary);
`

export const TextQuaternary = styled(Text)`
  color: var(--text-quaternary);
`

export const Title = (props: TextProps) => <Text fontSize="1.6rem" lineHeight="2.2rem" medium {...props} />

export const ExternalLink = styled('a')<
  { secondary?: boolean } & TextProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>`
  color: ${({ secondary }) => (secondary ? 'var(--text-secondary)' : 'var(--text-primary)')};
  &:hover {
    color: ${({ secondary }) => (secondary ? 'var(--text-primary)' : 'var(--text-accent)')};
  }
  text-decoration: none;
  letter-spacing: 0.3px;
  ${TextPropertyGenerator}
`
