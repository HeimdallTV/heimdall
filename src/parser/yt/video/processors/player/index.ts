import { ProviderName } from '@/parser/std'
import * as std from '@std'
import type { PlayerResponse } from '@yt/video/types/responses/player'

import type {
  PlayerAdaptiveFormat,
  PlayerAudioFormat,
  PlayerFormat,
  PlayerVideoFormat,
} from '../../types/streaming-data'
import { processCaptions } from './captions'
import { decodeVideoPlaybackUrl } from './decoders'

export async function processPlayer({
  videoDetails,
  playerConfig,
  streamingData,
  captions,
}: PlayerResponse): Promise<std.Player> {
  console.log(videoDetails, playerConfig, streamingData, captions)
  return {
    provider: ProviderName.YT,
    type: videoDetails.isLiveContent ? std.VideoType.Live : std.VideoType.Static,
    id: videoDetails.videoId,
    title: videoDetails.title,
    staticThumbnail: videoDetails.thumbnail.thumbnails,
    sources: await Promise.all([
      ...streamingData.formats.map(processFormat).map(decodeFormatUrl),
      ...streamingData.adaptiveFormats.map(processAdaptiveFormat).map(decodeFormatUrl),
    ]),
    closedCaptions: captions !== undefined ? processCaptions(captions) : [],
    viewedLength: playerConfig.playbackStartConfig?.startSeconds ?? 0,
    length: Number(videoDetails.lengthSeconds),
  }
}

export const processFormat = (format: PlayerFormat): std.Source<std.SourceType.AudioVideo> => ({
  type: std.SourceType.AudioVideo,
  frameRate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url ? format.url : signatureCipherToUrl(format.signatureCipher!),
  mimetype: format.mimeType,
})

export const processAdaptiveFormat = (format: PlayerAdaptiveFormat): std.Source =>
  'audioQuality' in format ? processAdaptiveAudioFormat(format) : processAdaptiveVideoFormat(format)

export const processAdaptiveVideoFormat = (
  format: PlayerAdaptiveFormat & PlayerVideoFormat,
): std.Source<std.SourceType.Video> => ({
  type: std.SourceType.Video,
  frameRate: format.fps,
  width: format.width,
  height: format.height,
  url: format.url ? format.url : signatureCipherToUrl(format.signatureCipher!),
  mimetype: format.mimeType,
  videoBitrate: format.bitrate,
})

export const processAdaptiveAudioFormat = (
  format: PlayerAdaptiveFormat & PlayerAudioFormat,
): std.Source<std.SourceType.Audio> => ({
  type: std.SourceType.Audio,
  url: format.url ? format.url : signatureCipherToUrl(format.signatureCipher!),
  mimetype: format.mimeType,
  audioBitrate: format.bitrate,
})

// todo: docs
const signatureCipherToUrl = (signatureCipher: string): string => {
  const params = new URLSearchParams(signatureCipher)
  const url = new URL(params.get('url')!)
  const urlParams = new URLSearchParams(url.search)
  urlParams.set('alr', 'yes')
  urlParams.set('sig', params.get('s')!)
  url.search = urlParams.toString()
  return url.toString()
}

export const decodeFormatUrl = async <Type extends std.SourceType = std.SourceType>(
  source: std.Source<Type>,
): Promise<std.Source<Type>> =>
  decodeVideoPlaybackUrl(new URL(source.url)).then((url) => ({ ...source, url: url.toString() }))

/*
nR = function(a, b, c) {
        b = void 0 === b ? "" : b;
        c = void 0 === c ? "" : c;
        a = new g.UP(a,!0);
        a.set("alr", "yes");
        c && (c = HKa(decodeURIComponent(c)),
        a.set(b, encodeURIComponent(c)));
        return a
    }
    ;

HKa = function(a) {
        a = a.split("");
        AP.B5(a, 3);
        AP.VE(a, 44);
        AP.SG(a, 2);
        AP.B5(a, 26);
        AP.SG(a, 3);
        AP.B5(a, 70);
        AP.SG(a, 2);
        return a.join("")
    }
    ;

var AP = {
    VE: function(a) {
        a.reverse()
    },
    B5: function(a, b) {
        var c = a[0];
        a[0] = a[b % a.length];
        a[b % a.length] = c
    },
    SG: function(a, b) {
        a.splice(0, b)
    }
};
*/

// https://rr5---sn-gvbxgn-tt1el.googlevideo.com/videoplayback?expire=1698454364&ei=_AY8ZcPkGq60lu8P8MqZoAQ&ip=99.230.243.183&id=o-APfEk_vHg6gmLREI0g6bzijFNGbor8kjz_1zVNfOCRQL&itag=315&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278%2C298%2C299%2C302%2C303%2C308%2C315&source=youtube&requiressl=yes&mh=su&mm=31%2C26&mn=sn-gvbxgn-tt1el%2Csn-vgqsrnes&ms=au%2Conr&mv=m&mvi=5&pl=20&ctier=A&pfa=5&initcwndbps=1702500&hightc=yes&siu=1&spc=UWF9fwPNQEY3fb-Jz7BfomdRPWu4NRp1LPvyZ6zU4AHp1wpInkQAipI&vprv=1&svpuc=1&mime=video%2Fwebm&ns=7SmC-OLZfSNcB-P3uuM2uu0P&gir=yes&clen=473065901&dur=651.050&lmt=1698173840471640&mt=1698432349&fvip=2&keepalive=yes&fexp=24007246&beids=24350018&c=WEB&txp=630F224&n=PoakL41SVtNbcrVB&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cctier%2Cpfa%2Chightc%2Csiu%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AK1ks_kwRQIhANl234xQoiFA_gwQmBqQA0_EJZDSnW4bCWQ0UqdUGZ7BAiAszrC3uMGSFP4Z6KariwSJ2jEVOKFzQduPtP0VNDAKOg%3D%3D

// https://rr5---sn-gvbxgn-tt1el.googlevideo.com/videoplayback?expire=1698454364&ei=_AY8ZcPkGq60lu8P8MqZoAQ&ip=99.230.243.183&id=o-APfEk_vHg6gmLREI0g6bzijFNGbor8kjz_1zVNfOCRQL&itag=251&source=youtube&requiressl=yes&mh=su&mm=31%2C26&mn=sn-gvbxgn-tt1el%2Csn-vgqsrnes&ms=au%2Conr&mv=m&mvi=5&pl=20&ctier=A&pfa=5&initcwndbps=1702500&hightc=yes&siu=1&spc=UWF9fwPNQEY3fb-Jz7BfomdRPWu4NRp1LPvyZ6zU4AHp1wpInkQAipI&vprv=1&svpuc=1&mime=audio%2Fwebm&ns=7SmC-OLZfSNcB-P3uuM2uu0P&gir=yes&clen=10075972&dur=651.061&lmt=1698173919335543&mt=1698432349&fvip=2&keepalive=yes&fexp=24007246&beids=24350018&c=WEB&txp=6308224&n=JxTCxacI51kdkg&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cctier%2Cpfa%2Chightc%2Csiu%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AK1ks_kwRgIhAJ5tDTpEZZRzG_LxXEQG-DWcrcxoYRylC5T3Mqo21V62AiEA559XvFf79Yfoq2EobhFHG2Q6tgd9I8hDPTlwPQpqL30%3D&alr=yes&sig=AGM4YrMwRQIhALfAgseeUdPcp9ifXHvPUPhU6Kjm2wOLcOEJyvSsCw3HAiBl5mQYfpbaF5023YuJukq87Gqnqn7OMY9I2l4Yp-UK5w%3D%3D&cpn=XdHknkASxwNo63gp&cver=2.20231026.03.00&rn=47&rbuf=18036&pot=Mlsn2UFg9Oa3YSfhKU7lvu3-6_MFbyj85WcXP3h56sbsDLIXiTxRw7b7O-2W8An0aQ7Mc2zmIhTdM9X4ndiI4Rs0TRMKIfMY5eZIYFQa7iqpMX2_jZvJbeqbrt9e&ump=1&srfvp=1
//
//

/*
{
    "expire": "1698454364",
    "ei": "_AY8ZcPkGq60lu8P8MqZoAQ",
    "ip": "99.230.243.183",
    "id": "o-APfEk_vHg6gmLREI0g6bzijFNGbor8kjz_1zVNfOCRQL",
    "itag": "315",
    "aitags": "133,134,135,136,160,242,243,244,247,278,298,299,302,303,308,315",
    "source": "youtube",
    "requiressl": "yes",
    "mh": "su",
    "mm": "31,26",
    "mn": "sn-gvbxgn-tt1el,sn-vgqsrnes",
    "ms": "au,onr",
    "mv": "m",
    "mvi": "5",
    "pl": "20",
    "ctier": "A",
    "pfa": "5",
    "initcwndbps": "1702500",
    "hightc": "yes",
    "siu": "1",
    "spc": "UWF9fwPNQEY3fb-Jz7BfomdRPWu4NRp1LPvyZ6zU4AHp1wpInkQAipI",
    "vprv": "1",
    "svpuc": "1",
    "mime": "video/webm",
    "ns": "7SmC-OLZfSNcB-P3uuM2uu0P",
    "gir": "yes",
    "clen": "473065901",
    "dur": "651.050",
    "lmt": "1698173840471640",
    "mt": "1698432349",
    "fvip": "2",
    "keepalive": "yes",
    "fexp": "24007246",
    "beids": "24350018",
    "c": "WEB",
    "txp": "630F224",
    "n": "PoakL41SVtNbcrVB",
    "sparams": "expire,ei,ip,id,aitags,source,requiressl,ctier,pfa,hightc,siu,spc,vprv,svpuc,mime,ns,gir,clen,dur,lmt",
    "lsparams": "mh,mm,mn,ms,mv,mvi,pl,initcwndbps",
    "lsig": "AK1ks_kwRQIhANl234xQoiFA_gwQmBqQA0_EJZDSnW4bCWQ0UqdUGZ7BAiAszrC3uMGSFP4Z6KariwSJ2jEVOKFzQduPtP0VNDAKOg=="
}

{
    "expire": "1698454364",
    "ei": "_AY8ZcPkGq60lu8P8MqZoAQ",
    "ip": "99.230.243.183",
    "id": "o-APfEk_vHg6gmLREI0g6bzijFNGbor8kjz_1zVNfOCRQL",
    "itag": "315",
    "aitags": "133,134,135,136,160,242,243,244,247,278,298,299,302,303,308,315",
    "source": "youtube",
    "requiressl": "yes",
    "mh": "su",
    "mm": "31,26",
    "mn": "sn-gvbxgn-tt1el,sn-vgqsrnes",
    "ms": "au,onr",
    "mv": "m",
    "mvi": "5",
    "pl": "20",
    "ctier": "A",
    "pfa": "5",
    "initcwndbps": "1702500",
    "hightc": "yes",
    "siu": "1",
    "spc": "UWF9fwPNQEY3fb-Jz7BfomdRPWu4NRp1LPvyZ6zU4AHp1wpInkQAipI",
    "vprv": "1",
    "svpuc": "1",
    "mime": "video/webm",
    "ns": "7SmC-OLZfSNcB-P3uuM2uu0P",
    "gir": "yes",
    "clen": "473065901",
    "dur": "651.050",
    "lmt": "1698173840471640",
    "mt": "1698432349",
    "fvip": "2",
    "keepalive": "yes",
    "fexp": "24007246",
    "beids": "24350018",
    "c": "WEB",
    "txp": "630F224",
    "n": "JxTCxacI51kdkg",
    "sparams": "expire,ei,ip,id,aitags,source,requiressl,ctier,pfa,hightc,siu,spc,vprv,svpuc,mime,ns,gir,clen,dur,lmt",
    "lsparams": "mh,mm,mn,ms,mv,mvi,pl,initcwndbps",
    "lsig": "AK1ks_kwRQIhANl234xQoiFA_gwQmBqQA0_EJZDSnW4bCWQ0UqdUGZ7BAiAszrC3uMGSFP4Z6KariwSJ2jEVOKFzQduPtP0VNDAKOg==",
    "alr": "yes",
    "sig": "AGM4YrMwRQIgZL7VudIIGoSAl3D2pTjd9aqRs1NF_FjXma0l3UD_L9kCIQCazN4F_KNOqhZzjIywA6pEv0DOAzciP6mgT03Oa6qZqQ==",
    "cpn": "XdHknkASxwNo63gp",
    "cver": "2.20231026.03.00",
    "range": "32691863-37202458",
    "rn": "46",
    "rbuf": "16232",
    "pot": "Mlsn2UFg9Oa3YSfhKU7lvu3-6_MFbyj85WcXP3h56sbsDLIXiTxRw7b7O-2W8An0aQ7Mc2zmIhTdM9X4ndiI4Rs0TRMKIfMY5eZIYFQa7iqpMX2_jZvJbeqbrt9e",
    "ump": "1",
    "srfvp": "1"
}
*/
