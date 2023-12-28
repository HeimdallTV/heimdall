import { Navigation } from '../components/utility/navigation'

// Some
export function someToArray<T, U>(value: Some<SomeOptions<T, U>>): (T | U)[] {
  if (typeof value === 'object' && value !== null && 'runs' in value) return value.runs
  return [value as T]
}

export const headOfSome = <T, U>(value: Some<SomeOptions<T, U>>) => someToArray(value)[0]

export type Runs<T> = { runs: T[] }
export type Some<T extends SomeOptions<any, any> | SubCommand> = T extends SomeOptions<
  infer Single,
  infer Many
>
  ? Single | Runs<Many>
  : never
export type SomeCommands<T extends SubCommand> = T extends Action
  ? { actions: T[] }
  : { commandExecutorCommand: { commands: T[] } }
export type SomeOptions<Single, Many> = { single: Single; many: Many }

// Renderer
export const unwrapRenderer = <T extends Renderer>(
  renderer: T,
): keyof T extends `${infer Key}Renderer` | '__typeName' ? T[`${Key}Renderer`] : never =>
  // @ts-ignore
  renderer[Object.keys(renderer).find(key => key.includes('Renderer'))!]

export const isRenderer =
  <Name extends string>(name: Name) =>
  <MaybeRenderer extends Renderer>(
    renderer: MaybeRenderer,
    // @ts-ignore
  ): renderer is MaybeRenderer extends Renderer<Name>
    ? { [P in keyof Renderer<Name>]: MaybeRenderer[P] }
    : never =>
    `${name}Renderer` in renderer

export const findRenderer =
  <Name extends string>(name: Name) =>
  <Renderers extends Renderer>(
    renderers: Renderers[],
  ):
    | (Renderers extends Renderer<Name> ? (Renderers & Renderer<Name>)[`${Name}Renderer`] : never)
    | undefined =>
    // @ts-ignore
    findRendererRaw(name)(renderers)?.[`${name}Renderer`]

export const findRendererRaw =
  <Name extends string>(name: Name) =>
  <Renderers extends Renderer>(
    renderers: Renderers[],
  ): (Renderers extends Renderer<Name> ? Renderers & Renderer<Name> : never) | undefined =>
    // @ts-ignore
    renderers.find(renderer => `${name}Renderer` in renderer)

export type Renderer<
  Name extends string = string,
  Props extends Record<string, any> = Record<string, any>,
> = {
  [K in `${Name}Renderer`]: Props
} & { __typeName: 'renderer' }

// View Model
export const unwrapViewModel = <T extends ViewModel>(
  viewModel: T,
): keyof T extends `${infer Key}ViewModel` | '__typeName' ? T[`${Key}ViewModel`] : never =>
  // @ts-ignore
  viewModel[Object.keys(viewModel).find(key => key.includes('ViewModel'))!]

export const isViewModel =
  <Name extends string>(name: Name) =>
  <MaybeViewModel extends ViewModel>(
    viewModel: MaybeViewModel,
    // @ts-ignore
  ): viewModel is MaybeViewModel extends ViewModel<Name>
    ? { [P in keyof ViewModel<Name>]: MaybeViewModel[P] }
    : never =>
    `${name}ViewModel` in viewModel

export const findViewModel =
  <Name extends string>(name: Name) =>
  <ViewModels extends ViewModel>(
    viewModels: ViewModels[],
  ):
    | (ViewModels extends ViewModel<Name> ? (ViewModels & ViewModel<Name>)[`${Name}ViewModel`] : never)
    | undefined =>
    // @ts-ignore
    findViewModelRaw(name)(viewModels)?.[`${name}ViewModel`]

export const findViewModelRaw =
  <Name extends string>(name: Name) =>
  <ViewModels extends ViewModel>(
    viewModels: ViewModels[],
  ): (ViewModels extends ViewModel<Name> ? ViewModels & ViewModel<Name> : never) | undefined =>
    // @ts-ignore
    viewModels.find(viewModel => `${name}ViewModel` in viewModel)

export type ViewModel<
  Name extends string = string,
  Props extends Record<string, any> = Record<string, any>,
> = {
  [K in `${Name}ViewModel`]: Props
} & { __typeName: 'viewModel' }

// Command
export type SubCommand = Command | ServiceEndpoint | Endpoint | Action
export type OptionalSubCommand = SubCommand | undefined

export type Command<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined,
> = {
  [K in `${Name}Command`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
      ? SubCommand // | { actions: SubCommand[] }
      : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'command'
}

export const isCommand =
  <Name extends string>(name: Name) =>
  <MaybeCommand extends SubCommand>(
    command: MaybeCommand,
    // @ts-ignore
  ): command is MaybeCommand extends Command<Name>
    ? { [P in keyof Command<Name>]: MaybeCommand[P] }
    : never =>
    `${name}Command` in command

export type CommandMetadata = {
  commandMetadata: WebCommandMetadata
} // & ClickTracking

type WebCommandMetadata = {
  sendPost?: boolean
  url: string
  webPageType: string
  rootVe: number
  apiUrl: string
}

export type ServiceEndpoint<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined,
> = {
  [K in `${Name}ServiceEndpoint`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
      ? SubCommand // | { actions: SubCommand[] }
      : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'serviceEndpoint'
}

export type Endpoint<
  Name extends string = string,
  Properties extends Record<string, any> = {},
  SubCommand extends Command | ServiceEndpoint | Endpoint | Action | undefined = undefined,
> = {
  [K in `${Name}Endpoint`]: (SubCommand extends Command | ServiceEndpoint | Endpoint
    ? SubCommand // | { commandExecutorCommand: { commands: SubCommand[] } }
    : SubCommand extends Action
      ? SubCommand // | { actions: SubCommand[] }
      : {}) &
    // Partial<ClickTracking> &
    Properties
} & {
  __typeName: 'endpoint'
}

export type Action<
  Name extends string = string,
  Properties extends Record<string, any> = Record<string, any>,
> = {
  [K in `${Name}Action`]: Properties // & Partial<ClickTracking>
} & {
  __typeName: 'action'
}

export type ExtractCommand<_Command extends any> = _Command extends Command<infer Name>
  ? { command: _Command[`${Name}Command`] }
  : _Command extends ServiceEndpoint<infer Name>
    ? { serviceEndpoint: _Command[`${Name}ServiceEndpoint`] }
    : _Command extends Navigation<infer Name>
      ? { navigationEndpoint: _Command[`navigationEndpoint`] }
      : _Command extends Endpoint<infer Name>
        ? { endpoint: _Command[`${Name}Endpoint`] }
        : _Command extends Action<infer Name>
          ? { action: _Command[`${Name}Action`] }
          : {}

export type ExtractRawCommand<_Command extends any> = _Command extends Command<infer Name>
  ? _Command[`${Name}Command`]
  : _Command extends ServiceEndpoint<infer Name>
    ? _Command[`${Name}ServiceEndpoint`]
    : _Command extends Endpoint<infer Name>
      ? _Command[`${Name}Endpoint`]
      : _Command extends Action<infer Name>
        ? _Command[`${Name}Action`]
        : {}
