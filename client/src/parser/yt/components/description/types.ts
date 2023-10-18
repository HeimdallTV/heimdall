import { Command, CommandMetadata } from '@yt/core/internals'
import { UrlEndpoint, WatchEndpoint } from '../utility/endpoint'

export type Unit = {
  // TODO: More here but haven't discovered
  unit: 'DIMENSION_UNIT_POINT'
  // TODO: Maybe more here but haven't discovered
  value: number
}

export type LayoutProperties = {
  height: Unit
  width: Unit
}

/** Used for mini attachments within the description */
export type AttributedDescriptionAttachment = {
  // TODO: More here but haven't discovered
  alignment: 'ALIGNMENT_VERTICAL_CENTER'
  /** Index in the description text where this attachment should be applied */
  startIndex: number
  /** Length of the text in the description where this attachment should be applied. endIndex = startIndex + length */
  length: number
  /** TODO Information about the attachment itself such as its width + height, images and possibly more that I haven't discovered */
  element: {
    properties: { layoutProperties: LayoutProperties }
    type: {
      imageType: {
        image: { sources: { url: string }[] }
      }
    }
  }
}

/** A command applied to a substring of the description text */
export type AttributedDescriptionCommand = {
  /** Index in the description text where this command should be applied */
  startIndex: number
  /** Length of the text in the description where this command should be applied. endIndex = startIndex + length */
  length: number
  /** Left out because it's purely for tracking */
  // loggingDirective?: { enableDisplayloggerExperiment: boolean, trackingParams: string }
  /** TODO Only discovered the onTap command so far with WatchEndpoint and UrlEndpoint. This is likely incomplete */
  onTap: Command<'innertube', CommandMetadata, WatchEndpoint | UrlEndpoint>
}

/**
 * Defines some styling for a section of the text such as the background colour but notably
 * does not define the colour for the text. That is done by the AttributedDescriptionStyle
 * Only ever seen this used to add a background to a link that points to a youtube video
 * in coordination with an AttributedDescriptionAttachment and AttributedDescriptionCommand
 */
export type AttributedDescriptionDecoration = {
  /** TODO Only discovered the highlightTextDecorator so far but I imagine there's more */
  textDecorator: {
    highlightTextDecorator: {
      /** Index in the description text where this decoration should be applied */
      startIndex: number
      /** Length of the text in the description where this decoration should be applied. endIndex = startIndex + length */
      length: number
      /**
       * TODO Never seen this not exist but also never seen this decorator used for anything other than
       * a fancy background for a youtube video
       */
      backgroundColor?: number
      /**
       * TODO Never seen this not exist but also never seen this decorator used for anything other than
       * a fancy background for a youtube video
       */
      backgroundCornerRadius?: number
    }
  }
}

export type AttributedDescriptionStyle = {
  /** Index in the description text where this style should be applied */
  startIndex: number
  /** Length of the text in the description where this style should be applied. endIndex = startIndex + length */
  length: number
  /**
   * The font color encoded as 32 bits like an android colour
   * https://developer.android.com/reference/android/graphics/Color#decoding
   * const A = (color >> 24) & 0xff // or color >>> 24
   * const R = (color >> 16) & 0xff
   * const G = (color >>  8) & 0xff
   * const B = (color      ) & 0xff
   * TODO Only discovered font color
   */
  fontColor: number
}

export type AttributedDescription = {
  content: string
  attachmentRuns: AttributedDescriptionAttachment[]
  commandRuns: AttributedDescriptionCommand[]
  decorationRuns: AttributedDescriptionDecoration[]
  styleRuns: AttributedDescriptionStyle[]
}
