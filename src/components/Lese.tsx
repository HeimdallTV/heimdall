import { styled } from '@linaria/react'

// Separation parsing
export const parseSeparations = (separation: string) => {
  const separations = separation.split(' ').filter(Boolean)
  if (separations.length === 1) {
    return { rest: separations[0], starting: [], ending: [] }
  }

  const isRestSeparation = (separation: string) => separation.startsWith('...')
  const restSeparations = separations.filter(isRestSeparation)
  if (restSeparations.length > 1) {
    throw new Error('separation can only contain one rest operator')
  }
  const restSeparationIndex = separations.findIndex(a => isRestSeparation(a))
  const startingSeparations = separations.slice(
    0,
    restSeparationIndex === -1 ? separations.length : restSeparationIndex,
  )
  const endingSeparations = separations.slice(
    restSeparationIndex === -1 ? separations.length : restSeparationIndex + 1,
  )
  return { rest: restSeparations[0], starting: startingSeparations, ending: endingSeparations }
}

const getStartSeparation = (separation: string, index: number) => {
  const separations = parseSeparations(separation)
  return separations.starting[index] ?? separations.rest
}
const getRestSeparation = (separation: string) => parseSeparations(separation).rest
const getEndSeparation = (separation: string, index: number) => {
  const separations = parseSeparations(separation)
  return separations.ending[index] ?? separations.rest
}

// Flex
export type FlexProps = React.PropsWithChildren<
  React.PropsWithRef<{
    xAlign?: boolean | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
    yAlign?: boolean | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
    align?: boolean | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
    separation?: string
  }>
>

function fallback<T>(value: T | boolean | undefined, trueValue: T, defaultValue: T): T {
  if (value === true) return trueValue
  if (value === false || value === undefined) return defaultValue
  return value
}

const RowBase = styled.div<FlexProps>`
  display: flex;
  flex-direction: row;
  align-items: ${({ yAlign, align }) => fallback(yAlign ?? align, 'center', 'normal')};
  justify-content: ${({ xAlign, align }) => fallback(xAlign ?? align, 'center', 'normal')};

  &.sep > * + * {
    margin-left: ${({ separation }) => getRestSeparation(separation ?? '0px')};
  }
  &.sep > *:nth-child(1) + * {
    margin-left: ${({ separation }) => getStartSeparation(separation ?? '0px', 0)};
  }
  &.sep > *:nth-child(2) + * {
    margin-left: ${({ separation }) => getStartSeparation(separation ?? '0px', 1)};
  }
  &.sep > *:nth-child(3) + * {
    margin-left: ${({ separation }) => getStartSeparation(separation ?? '0px', 2)};
  }
  &.sep > *:nth-child(4) + * {
    margin-left: ${({ separation }) => getStartSeparation(separation ?? '0px', 3)};
  }
`
export const Row: React.FC<FlexProps> = ({ separation, ...props }) => (
  <RowBase className={separation !== undefined ? 'sep' : ''} separation={separation} {...props} />
)

const ColumnBase = styled.div<FlexProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ xAlign, align }) => fallback(xAlign ?? align, 'center', 'normal')};
  justify-content: ${({ yAlign, align }) => fallback(yAlign ?? align, 'center', 'normal')};

  &.sep > * + * {
    margin-top: ${({ separation }) => getRestSeparation(separation ?? '0px')};
  }
  &.sep > *:nth-child(1) + * {
    margin-top: ${({ separation }) => getStartSeparation(separation ?? '0px', 0)};
  }
  &.sep > *:nth-child(2) + * {
    margin-top: ${({ separation }) => getStartSeparation(separation ?? '0px', 1)};
  }
  &.sep > *:nth-child(3) + * {
    margin-top: ${({ separation }) => getStartSeparation(separation ?? '0px', 2)};
  }
  &.sep > *:nth-child(4) + * {
    margin-top: ${({ separation }) => getStartSeparation(separation ?? '0px', 3)};
  }
`
export const Column: React.FC<FlexProps> = ({ separation, ...props }) => (
  <ColumnBase className={separation !== undefined ? 'sep' : ''} separation={separation} {...props} />
)

// Grid
export type GridProps = React.PropsWithChildren<{
  columns?: string
  rows?: string
  autoColumns?: string
  autoRows?: string
  columnGap?: string
  rowGap?: string
  gap?: string
  xAlign?: boolean | string
  yAlign?: boolean | string
  align?: boolean | string
}>

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns ?? 'auto'};
  grid-template-rows: ${({ rows }) => rows ?? 'auto'};
  grid-auto-columns: ${({ autoColumns }) => autoColumns ?? 'auto'};
  grid-auto-rows: ${({ autoRows }) => autoRows ?? 'auto'};
  grid-column-gap: ${({ columnGap }) => columnGap ?? '0px'};
  grid-row-gap: ${({ rowGap }) => rowGap ?? '0px'};
  grid-gap: ${({ gap }) => gap ?? '0px'};
  justify-items: ${({ align, xAlign }) => fallback(xAlign ?? align, 'center', 'normal')};
  align-items: ${({ align, yAlign }) => fallback(yAlign ?? align, 'center', 'normal')};
`
