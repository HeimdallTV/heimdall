import { RichTextChunk, RichTextChunkType } from '@std'
import { AttributedDescription } from './types'
import { getEndpointUrl } from '../utility/endpoint'

function isUrl(str: string) {
  try {
    new URL(str)
    return true
  } catch (err) {
    return false
  }
}

/**
 * Parses an attributed description into RichTextChunks
 * TODO Only supports parsing the command runs but not attachment, decoration or style runs
 * TODO Map internal YT urls to heimdall urls
 */
export const parseAttributedDescription = (description: AttributedDescription): RichTextChunk[] =>
  description.commandRuns
    .map(command => ({
      ...command,
      endIndex: command.startIndex + command.length,
    }))
    .reverse()
    .reduce<RichTextChunk[]>(
      (richTextChunks, command) => [
        {
          type: RichTextChunkType.Text,
          content: richTextChunks[0].content.slice(0, command.startIndex),
        },
        {
          type: RichTextChunkType.Text,
          content: description.content.slice(command.startIndex, command.startIndex + command.length),
          href: getEndpointUrl(command.onTap.innertubeCommand),
        },
        {
          type: RichTextChunkType.Text,
          content: richTextChunks[0].content.slice(command.endIndex),
        },
        ...richTextChunks.slice(1)
      ],
      [{ type: RichTextChunkType.Text, content: description.content }],
    )
    /** The above code can lead to empty  */
    .filter(chunk => chunk.content.length > 0)
