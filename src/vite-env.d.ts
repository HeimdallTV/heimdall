/// <reference types="vite/client" />
import type { ReactNode, FC as _FC } from 'react'

declare global {
  type FC<P = Record<never, never>> = _FC<P>
  type PropsWithChildren<P = Record<never, never>> = P & { children?: ReactNode[] | ReactNode | undefined }
}
