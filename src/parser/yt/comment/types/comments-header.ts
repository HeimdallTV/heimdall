import { Button } from '../../components/button'
import { Text } from '../../components/text'
import { Thumbnail } from '../../components/thumbnail'
import { Endpoint, Renderer, ServiceEndpoint, Some } from '../../core/internals'

export type CommentsHeader = Renderer<
	'commentsHeader',
	{
		/** Number in the form of a string for the number of comments */
		commentsCount: Some<Text>
		/** Header to show at the top of the comments section i.e. "3 comments"*/
		countText: Some<Text>
		createRenderer: CommentSimpleBox
		/** List of custom emoji that can be used in comments */
		customEmoji: { TODO: true }[]
		showSeparator: boolean
		sortMenu: { TODO: true }
		/** Title of the comments section. Appears to be unused. i.e. "Comments" */
		titleText: Some<Text>
		/** Url to get the unicode emojis in the form a JSON */
		unicodeEmojisUrl: string
	}
>

type CommentSimpleBox = Renderer<
	'commentSimpleBox',
	{
		aadcGuidelinesStateEntityKey: string
		authorThumbnail: Thumbnail
		avatarSize: string
		cancelButton: Button
		emojiButton: Button
		emojiPicker: { TODO: true }
		placeholderText: Some<Text>
		submitButton: Button<ServiceEndpoint<'', Record<never, never>, CreateCommentEndpoint>>
	}
>

type CreateCommentEndpoint = Endpoint<'createComment', { createCommentParams: string }>
