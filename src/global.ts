import { prop } from 'ramda'
import { flow, pipe, identity } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'

globalThis.prop = prop
globalThis.flow = flow
globalThis.pipe = pipe
globalThis.identity = identity
globalThis.A = A
globalThis.NEA = NEA
