import type React from 'react'
import styled from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'
import Base from './Base'
import { propertyGenerator } from '../helpers'

export interface FlexProps {
  column?: boolean
  reverse?: boolean
  align?: boolean
  xAlign?: boolean | string
  yAlign?: boolean | string
  separation?: string | string[]
  wrap?: boolean | string
}

export type SeparationProps = Pick<FlexProps, 'column' | 'separation'>
export const separationProp = ({ column, separation }: Pick<FlexProps, 'column' | 'separation'>) => {
  if (separation === undefined) return ''

  const isString = typeof separation === 'string'
  const isStringArray = Array.isArray(separation)
  if (!isString && !isStringArray) {
    throw new Error('separation must be a string or string array')
  }

  const getStyleBlock = (selector: string, separation: string) => `
    > ${selector} {
      ${column ? `margin-top: ${separation}` : `margin-left: ${separation}`};
    }
  `

  const separations = isStringArray ? separation : separation.split(' ').filter(Boolean)
  if (separations.length > 1 || isStringArray) {
    const isRestSeparation = (separation: string) => separation.startsWith('...')
    const restSeparations = separations.filter(isRestSeparation)
    if (restSeparations.length > 1) {
      throw new Error('separation can only contain one rest operator')
    }

    const restSeparationIndex = separations.findIndex((a) => isRestSeparation(a))
    const startingSeparations = separations.slice(
      0,
      restSeparationIndex === -1 ? separations.length : restSeparationIndex,
    )
    const endingSeparations = separations.slice(
      restSeparationIndex === -1 ? separations.length : restSeparationIndex + 1,
    )

    return [
      ...restSeparations.map((separation) => getStyleBlock('* + *', separation.slice(3))),
      // Order is important since we want startingSeparations to replace endingSeparations
      ...endingSeparations.map((separation, i) =>
        getStyleBlock(`*:nth-last-child(${endingSeparations.length - i})`, separation),
      ),
      ...startingSeparations.map((separation, i) =>
        getStyleBlock(`*:first-child ${new Array(i + 1).fill('+ *').join(' ')}`, separation),
      ),
    ].join('\n')
  }
  return getStyleBlock('* + *', separation)
}

const applyDefaultProps =
  <T, U>(defaultProps: Partial<T>, callback: (arg: T) => U) =>
  (props: T) =>
    callback({ ...defaultProps, ...props })

const getFlexProperties = propertyGenerator<FlexProps>([
  ['column', () => 'flex-direction: column'],
  ['reverse', { handler: ({ column }) => `flex-direction: ${column ? 'column' : 'row'}-reverse` }],
  [
    'align',
    {
      default: 'center',
      handler: ({ align }) => `align-items: ${align}; justify-content: ${align}`,
    },
  ],
  [
    'xAlign',
    {
      default: 'center',
      handler: ({ column, xAlign }) => (column ? `align-items: ${xAlign}` : `justify-content: ${xAlign}`),
    },
  ],
  [
    'yAlign',
    {
      default: 'center',
      handler: ({ column, yAlign }) => (column ? `justify-content: ${yAlign}` : `align-items: ${yAlign}`),
    },
  ],
  ['separation', separationProp],
  ['wrap', { default: 'wrap', property: 'flex-wrap' }],
])

const getRowProperties = applyDefaultProps({ column: false }, getFlexProperties)
const getColumnProperties = applyDefaultProps({ column: true }, getFlexProperties)

export default styled(Base).withConfig({
  shouldForwardProp: (prop) => getFlexProperties.shouldForwardProp(prop) && isPropValid(prop),
})<React.PropsWithChildren<FlexProps>>`
  display: flex;
  ${getFlexProperties}
`

export const Row = styled(Base).withConfig({
  shouldForwardProp: (prop) => getFlexProperties.shouldForwardProp(prop) && isPropValid(prop),
})<React.PropsWithChildren<FlexProps>>`
  display: flex;
  ${getRowProperties}
`

export const Column = styled(Base).withConfig({
  shouldForwardProp: (prop) => getFlexProperties.shouldForwardProp(prop) && isPropValid(prop),
})<React.PropsWithChildren<FlexProps>>`
  display: flex;
  ${getColumnProperties}
`
