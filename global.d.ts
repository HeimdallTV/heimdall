/* eslint-disable */
import { prop as _prop } from 'rambda'
import { flow as _flow, pipe as _pipe, identity as _identity, Lazy as _Lazy } from 'fp-ts/function'
import * as _A from 'fp-ts/Array'
import * as _NEA from 'fp-ts/NonEmptyArray'
import { NonEmptyArray as _NonEmptyArray } from 'fp-ts/NonEmptyArray'

import { ReactNode, FC as _FC } from 'react'

declare global {
  var prop: typeof _prop
  var flow: typeof _flow
  var pipe: typeof _pipe
  var identity: typeof _identity
  var A: typeof _A
  var NEA: typeof _NEA

  type NonEmptyArray<A> = _NonEmptyArray<A>
  type Lazy<A> = _Lazy<A>

  type FC<P = Record<never, never>> = _FC<P>
  type PropsWithChildren<P = Record<never, never>> = P & { children?: ReactNode[] | ReactNode | undefined }
}
