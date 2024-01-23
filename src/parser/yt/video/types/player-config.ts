export type PlayerConfig = {
	audioConfig: {
		loudnessDb: number
		perceptualLoudnessDb: number
		enablePerFormatLoudness: boolean
	}
	playbackStartConfig?: {
		startSeconds: number
	}
	streamSelectionConfig: {
		/** Number formatted as string Ex. "13990000" */
		maxBitrate: string
	}
	mediaCommonConfig: {
		dynamicReadaheadConfig: {
			maxReadAheadMediaTimeMs: number
			minReadAheadMediaTimeMs: number
			readAheadGrowthRateMs: number
		}
	}
	webPlayerConfig: {
		webPlayerActionsPorting: Record<string, unknown>
	}
}
