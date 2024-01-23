import { Button, ToggleButton } from '../../components/button'
import { LikeStatus } from '../../components/like-status'
import { ManyText, SingleText, Text } from '../../components/text'
import { Thumbnail } from '../../components/thumbnail'
import { Accessibility } from '../../components/utility/accessibility'
import { BrowseEndpoint } from '../../components/utility/endpoint'
import { AllNavigation, Navigation } from '../../components/utility/navigation'
import {
	Command,
	CommandMetadata,
	Endpoint,
	Renderer,
	ServiceEndpoint,
	Some,
	SomeOptions,
} from '../../core/internals'
import { AuthorCommentBadge, PinnedCommentBadge } from './badge'

type PerformCommentActionEndpoint = Endpoint<
	'performCommentAction',
	{ action: string; clientActions: { TODO: true } }
>

type CommentLikeToggleButton = ToggleButton<
	Command<'', Record<never, never>, PerformCommentActionEndpoint & CommandMetadata>,
	Command<'', Record<never, never>, PerformCommentActionEndpoint & CommandMetadata>
>

type CreateCommentReply = Command<'createCommentReply', { createReplyParams: string }>
type CreateCommentReplyDialog = Endpoint<'createCommentReplyDialog', { dialog: CommentReplyDialog }>
type CommentReplyDialog = Renderer<
	'commentReplyDialog',
	{
		aadcGuidelinesStateEntityKey: string
		authorThumbnails: Thumbnail
		cancelButton: Button
		emojiButton: Button
		emojiPicker: { TODO: true }
		errorMessage: Some<Text>
		placeholderText: Some<Text>
		replyButton: Button<ServiceEndpoint<'', Record<never, never>, CreateCommentReply>>
	}
>

type CommentActionButtons = Renderer<
	'commentActionButtons',
	{
		dislikeButton: CommentLikeToggleButton
		likeButton: CommentLikeToggleButton
		replyButton: Button<Navigation<CreateCommentReplyDialog>>
		style: string
		/**
		 * Number in the form of a string that seems to indicate the unix
		 * timestamp of when the parameters for sending like/dislike/reply requests
		 * were created
		 */
		protoCreationMs: string
	}
>

export type Comment = Renderer<
	'comment',
	{
		/** Unique identifier for the comment */
		commentId: string
		/** Comment message */
		// fixme: not correct because the navigation is optional
		contentText: CommentContent

		actionMenu: Record<never, never> // todo:
		actionButtons: CommentActionButtons

		authorCommentBadge: AuthorCommentBadge
		/** Name of the author */
		authorText: Some<Text>
		authorThumbnail: Thumbnail & Accessibility
		authorEndpoint: BrowseEndpoint & CommandMetadata
		authorIsChannelOwner: boolean

		/** Thumbnail for the logged in user */
		currentUserReplyThumbnail: Thumbnail
		/** Only defined when the comment is pinned */
		pinnedCommentBadge?: PinnedCommentBadge
		/** Relative time like "15 hours ago" but can include "(edited)" at the end */
		publishedTimeText: Some<Text>

		replyCount: number
		/** Defined when the replyCount > 0 */
		collapseButton?: Button
		/** Defined when the replyCount > 0 */
		expandButton?: Button

		isLiked: boolean
		/** Text like "366" indicating the number of likes */
		voteCount: Some<Accessibility<Text>>
		/** Whether the user has liked, disliked or done neither */
		voteStatus: LikeStatus
	}
>

export type CommentContent = Some<
	SomeOptions<Partial<AllNavigation> & SingleText, Partial<AllNavigation> & ManyText>
>
