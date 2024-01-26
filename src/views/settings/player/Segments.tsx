import * as std from '@std'
import {
	PlayerSegmentCategorySettings,
	PlayerSegmentCategoryBehavior,
	PlayerSegmentHighlightBehavior,
	playerSegmentsAtom,
	playerSegmentsCategoriesAtom,
	playerSegmentsHighlightAtom,
} from '@/settings'
import {
	CheckIcon,
	Checkbox,
	Collapse,
	ColorSwatch,
	Divider,
	Popover,
	SegmentedControl,
	Switch,
	useMantineTheme,
} from '@mantine/core'
import { useAtom } from 'jotai'
import { Column, Row } from 'lese'
import { Label } from '../components'

export default function PlayerSegmentSettings() {
	const [segments, setSegments] = useAtom(playerSegmentsAtom)
	return (
		<>
			<Label
				label="Exclusive Access Disclaimer"
				description="Only for labeling entire videos. Used when a video showcases a product, service or location that they've received free or subsidized access to"
			>
				<Switch
					checked={segments.enableExclusiveAccess}
					onChange={(event) =>
						setSegments({ ...segments, enableExclusiveAccess: event.currentTarget.checked })
					}
				/>
			</Label>
			<Label
				label="External Chapters"
				description="Externally source chapters from comments and SponsorBlock, taking prority over YT chapters"
			>
				<Switch
					checked={segments.enableChapters}
					onChange={(event) => setSegments({ ...segments, enableChapters: event.currentTarget.checked })}
				/>
			</Label>
			<Divider />
			<PlayerSegmentHighlight />
			<Divider />
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Sponsor}
				title="Sponsor"
				description="Paid promotion, paid referrals and direct advertisements. Not for self-promotion or free shoutouts to causes/creators/websites/products they like"
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.SelfPromo}
				title="Unpaid/Self Promotion"
				description="Similar to 'sponsor' except for unpaid or self promotion. This includes sections about merchandise, donations, or information about who they collaborated with"
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Interaction}
				title="Interaction Reminder (Subscribe)"
				description="When there is a short reminder to like, subscribe or follow them in the middle of content. If it is long or about something specific, it should be under self promotion instead"
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Intro}
				title="Intermission/Intro Animation"
				description="An interval without actual content. Could be a pause, static frame, repeating animation. This should not be used for transitions containing information"
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Outro}
				title="Endcards/Credits"
				description="Credits or when the YouTube endcards appear. Not for conclusions with information"
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Preview}
				title="Preview/Recap"
				description="Collection of clips that show what is coming up in in this video or other videos in a series where all information is repeated later in the video."
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.Filler}
				title="Filler Tangent/Jokes"
				description='Tangential scenes added only for filler or humor that are not required to understand the main content of the video. This should not include segments providing context or background details. This is a very aggressive category meant for when you arent in the mood for "fun"'
			/>
			<PlayerSegmentCategory
				category={std.PlayerSegmentCategory.MusicOfftopic}
				title="Music: Non-Music Section"
				description="Only for use in music videos. This only should be used for sections of music videos that aren't already covered by another category"
			/>
		</>
	)
}

function PlayerSegmentOptions<T extends string>({
	title,
	description,
	enabled,
	onEnabledChange,
	color,
	onColorChange,
	shade,
	onShadeChange,
	behaviour,
	behaviours,
	onBehaviourChange,
}: {
	title: string
	description: string
	enabled: boolean
	onEnabledChange: (value: boolean) => void
	color: string
	onColorChange: (value: string) => void
	shade: number
	onShadeChange: (value: number) => void
	behaviour: T
	behaviours: { label: string; value: T }[]
	onBehaviourChange: (value: T) => void
}) {
	return (
		<Label label={title} description={description}>
			<Checkbox
				checked={enabled}
				onChange={(event) => onEnabledChange(event.currentTarget.checked)}
				style={{ justifySelf: 'center' }}
			/>
			<Collapse in={enabled} style={{ gridColumn: '2', gridRow: '3' }}>
				<Row separation="8px" yAlign>
					<ColorSwatchPicker
						color={color}
						onColorChange={onColorChange}
						shade={shade}
						onShadeChange={onShadeChange}
					/>
					<SegmentedControl
						value={behaviour}
						onChange={(value) => onBehaviourChange(value as T)}
						data={behaviours}
						transitionDuration={enabled ? 200 : 0}
						style={{ width: '100%' }}
					/>
				</Row>
			</Collapse>
		</Label>
	)
}

function PlayerSegmentHighlight() {
	const [highlight, setHighlight] = useAtom(playerSegmentsHighlightAtom)
	return (
		<PlayerSegmentOptions
			title="Highlights"
			description="The part of the video that most people are looking for"
			enabled={highlight.enabled}
			onEnabledChange={(value) => setHighlight({ ...highlight, enabled: value })}
			color={highlight.color}
			onColorChange={(value) => setHighlight({ ...highlight, color: value })}
			shade={highlight.shade}
			onShadeChange={(value) => setHighlight({ ...highlight, shade: value })}
			behaviour={highlight.behaviour}
			behaviours={[
				{ label: 'Show', value: PlayerSegmentHighlightBehavior.Show },
				{ label: 'Notify', value: PlayerSegmentHighlightBehavior.Notify },
				{ label: 'Automatically jump to', value: PlayerSegmentHighlightBehavior.Jump },
			]}
			onBehaviourChange={(value) => setHighlight({ ...highlight, behaviour: value })}
		/>
	)
}

function PlayerSegmentCategory({
	category: categoryEnum,
	title,
	description,
}: { category: std.PlayerSegmentCategory; title: string; description: string }) {
	const [categories, setCategories] = useAtom(playerSegmentsCategoriesAtom)
	const setCategory = (value: PlayerSegmentCategorySettings) =>
		setCategories({ ...categories, [categoryEnum]: value })
	const category = categories[categoryEnum]
	return (
		<PlayerSegmentOptions
			title={title}
			description={description}
			enabled={category.enabled}
			onEnabledChange={(value) => setCategory({ ...category, enabled: value })}
			color={category.color}
			onColorChange={(value) => setCategory({ ...category, color: value })}
			shade={category.shade}
			onShadeChange={(value) => setCategory({ ...category, shade: value })}
			behaviour={category.behavior}
			behaviours={[
				{ label: 'Show', value: PlayerSegmentCategoryBehavior.Show },
				{ label: 'Notify', value: PlayerSegmentCategoryBehavior.Notify },
				{ label: 'Skip', value: PlayerSegmentCategoryBehavior.Skip },
			]}
			onBehaviourChange={(value) => setCategory({ ...category, behavior: value })}
		/>
	)
}

function ColorSwatchPicker({
	disabled,
	color,
	onColorChange,
	shade,
	onShadeChange,
	style,
}: {
	disabled?: boolean
	color: string
	onColorChange: (value: string) => void
	shade: number
	onShadeChange: (value: number) => void
	style?: React.CSSProperties
}) {
	const theme = useMantineTheme()
	return (
		<Popover disabled={disabled}>
			<Popover.Target>
				<ColorSwatch
					component="button"
					color={theme.colors[color][shade]}
					style={{ cursor: 'pointer', ...style }}
				/>
			</Popover.Target>
			<Popover.Dropdown>
				<Column separation="8px" xAlign>
					<Row separation="4px">
						{Object.entries(theme.colors).map(([key, shades]) => (
							<ColorSwatchToggle
								key={key}
								toggled={key === color}
								color={shades[shade]}
								onColorChange={() => onColorChange(key)}
							/>
						))}
					</Row>
					<Row separation="4px">
						{theme.colors[color].map((value, index) => (
							<ColorSwatchToggle
								key={index}
								toggled={index === shade}
								color={value}
								onColorChange={() => onShadeChange(index)}
							/>
						))}
					</Row>
				</Column>
			</Popover.Dropdown>
		</Popover>
	)
}

function ColorSwatchToggle({
	toggled,
	color,
	onColorChange,
}: { toggled: boolean; color: string; onColorChange: (value: string) => void }) {
	return (
		<ColorSwatch
			component="button"
			color={color}
			onClick={() => onColorChange(color)}
			style={{ cursor: 'pointer', color: '#fff' }}
		>
			{toggled && <CheckIcon style={{ width: '1rem', height: '1rem' }} />}
		</ColorSwatch>
	)
}
