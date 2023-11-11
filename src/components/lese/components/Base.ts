import isPropValid from '@emotion/is-prop-valid'
import styled from 'styled-components'
import { propertyGenerator } from '../helpers'

export interface BaseProps {
  relative?: boolean
  margin?: string
  padding?: string
  width?: string
  height?: string
}

const getLayoutProperties = propertyGenerator<BaseProps>([
  ['relative', () => 'position: relative'],
  'margin',
  'padding',
  'width',
  'height',
])

export default styled.div.withConfig({
  shouldForwardProp: prop => getLayoutProperties.shouldForwardProp(prop) && isPropValid(prop),
})<BaseProps>`
  ${getLayoutProperties}
`
