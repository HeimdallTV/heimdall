'use client'
if (process.env.NEXT_PUBLIC_ENV === 'development') {
  const origConsoleError = console.error
  console.error = (...args: unknown[]) => {
    const isNestingWarning = (arg: unknown) => typeof arg === 'string' && arg.includes('validateDOMNesting')
    const [formatString, child, parent] = args
    if (isNestingWarning(formatString) && child === '<a>' && parent === 'a') {
      return
    }
    origConsoleError(...args)
  }
}
