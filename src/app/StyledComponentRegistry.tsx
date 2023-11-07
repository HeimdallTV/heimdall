// https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
'use client'

import React, { useState } from 'react'

import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  // todo: creates warning about multiple styled components instances
  if (typeof window !== 'undefined') {
    return (
      <StyleSheetManager enableVendorPrefixes shouldForwardProp={isPropValid}>
        {children}
      </StyleSheetManager>
    )
  }

  return (
    <StyleSheetManager
      enableVendorPrefixes
      shouldForwardProp={isPropValid}
      sheet={styledComponentsStyleSheet.instance}
    >
      {children}
    </StyleSheetManager>
  )
}
