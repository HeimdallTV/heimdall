import { RichTextChunk, RichTextChunkType } from '@std'
import { AttributedDescription, AttributedDescriptionCommand } from './types'
import { getEndpointUrl } from '../utility/endpoint'

export const parseAttributedDescriptionCommandRuns = (
  commandRuns: AttributedDescriptionCommand[],
  content: string,
): RichTextChunk[] =>
  commandRuns
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
          content: content.slice(command.startIndex, command.startIndex + command.length),
          href: getEndpointUrl(command.onTap.innertubeCommand),
        },
        {
          type: RichTextChunkType.Text,
          content: richTextChunks[0].content.slice(command.endIndex),
        },
        ...richTextChunks.slice(1),
      ],
      [{ type: RichTextChunkType.Text, content }],
    )
    /** The above code can lead to empty  */
    .filter(chunk => chunk.content.length > 0)

/**
 * Parses an attributed description into RichTextChunks
 * TODO Only supports parsing the command runs but not attachment, decoration or style runs
 * TODO Map internal YT urls to heimdall urls
 */
export const parseAttributedDescription = (description: AttributedDescription): RichTextChunk[] => {
  if (!description.commandRuns) {
    return [{ type: RichTextChunkType.Text, content: description.content }]
  }
  return parseAttributedDescriptionCommandRuns(description.commandRuns, description.content)
}
