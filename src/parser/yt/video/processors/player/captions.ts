import { PlayerCaptionsTracklist } from '@yt/video/types/captions'
import * as std from '@std'
import { fetchProxy } from '@libs/extension'

export const processCaptions = (captions: PlayerCaptionsTracklist): std.ClosedCaption[] => {
  const renderer = captions.playerCaptionsTracklistRenderer
  const defaultCaptionIndex = renderer.audioTracks[renderer.defaultAudioTrackIndex].defaultCaptionTrackIndex
  return renderer.captionTracks.map((caption, i) => ({
    language: caption.languageCode,
    isDefault: i === defaultCaptionIndex,
    getTrack: () =>
      fetchProxy(caption.baseUrl)
        .then(res => res.text())
        .then(parseXMLClosedCaptions),
  }))
}

const parseXMLClosedCaptions = (xml: string): std.ClosedCaptionTrack => {
  const parser = new DOMParser().parseFromString(xml, 'text/xml')
  const cues = Array.from(parser.querySelectorAll('transcript text'))
  return cues.map<std.ClosedCaptionTrackCue>(node => ({
    text: decodeHtmlText(node.textContent ?? ''),
    startTimeMS: Number(node.getAttribute('start')) * 1000,
    endTimeMS: (Number(node.getAttribute('start')) + Number(node.getAttribute('dur'))) * 1000,
  }))
}

function decodeHtmlText(encodedString: string): string {
  const element = document.createElement('div')
  element.innerHTML = encodedString
  return element.textContent!
}
