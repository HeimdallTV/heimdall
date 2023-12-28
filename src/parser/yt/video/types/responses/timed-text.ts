export type TimedText = {
  wireMagic: string
  events: TimedTextEvent[]
  wsWinStyles: TimedTextWindowStyle[]
  wpWinPos: TimedTextWindowPosition[]
  pens: unknown[]
}
export type TimedTextEvent = TimedTextWindowEvent | TimedTextSegmentEvent
export type TimedTextWindowEvent = {
  tStartMs: number
  dDurationMs: number
  id: number
  wpWinPosId: number
  wsWinStyleId: number
}
export type TimedTextSegmentEvent = {
  /** Absolute start time of the segment in the video */
  tStartMs: number
  /** Duration to show the segments for in total */
  dDurationMs: number
  /** Which window to place the segment in */
  wWinId: number
  /** Seems to indicate whether the segment should be added to the current line */
  aAppend?: number
  /** The segments themselves */
  segs: TimedTextSegment[]
}
export type TimedTextSegment = {
  /** The text of the segment */
  utf8: string
  /** The start time of the segment relative to the tStartMs of the parent event */
  tOffsetMs?: number
  acAsrConf?: number
}
/** Incomplete but we don't use it */
export type TimedTextWindowStyle = {
  mhModeHint?: number
  jujustifCode?: number
  sdScrollDir?: number
}
/** Incomplete but we don't use it */
export type TimedTextWindowPosition = {
  apPoint?: number
  ahHorizPor?: number
  avVertPor?: number
  rcRows?: number
  ccCols?: number
}
