export enum RichTextChunkType {
  Text = 'text',
  Image = 'image',
}

export type RichTextChunk = {
  type: RichTextChunkType
  content: string
  href?: string
}

export type RichText = RichTextChunk[]
