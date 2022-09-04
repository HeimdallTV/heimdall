async function getDecodedUrl(url) {
  const urlQueryParams = new URLSearchParams(url.search)

  const decodedNParam = await getDecodedNParam(urlQueryParams.get('n'))
  console.log(decodedNParam)
  urlQueryParams.set('n', decodedNParam)
  const decodedUrl = new URL(url)
  decodedUrl.search = urlQueryParams.toString()

  return decodedUrl
}

async function getDecodedNParam(n) {
  const playerUrl = 'https://www.youtube.com/watch?v=Lyr7CSpEmDk'
  const playerHTML = await fetch(playerUrl).then(res => res.text())

  const baseJSUrl = `https://youtube.com${playerHTML.match(/(?:href|src)="(.+base\.js)"/)[1]}`
  const baseJS = await fetch(baseJSUrl).then(res => res.text())

  const nameOfConsumerFunction = baseJS.match(/\.get\("n"\).+?(\w+)\[\d+\]\(\w+?\)/)[1]
  const nameOfWrapperFunction = baseJS.match(new RegExp(`${nameOfConsumerFunction}=\\[(\\w+?)\\]`))[1]
  const functionBody = baseJS.match(
    new RegExp(`${nameOfWrapperFunction}=(function\\(.+?\\){[^]+?};)\\n?.+?=function`),
  )[1]
  return eval(`(${functionBody.slice(0, -1)})("${n}")`)
}

const url = new URL('https://rr3---sn-gvbxgn-tt1e7.googlevideo.com/videoplayback?expire=1688356286&ei=XvGhZKi5IuGllu8PsMeF8A0&ip=99.230.243.183&id=o-AEPKBxl0AgNPHEqe8kq1AJrneSs4c7M-HFbiG4ntbQc6&itag=315&aitags=133%2C134%2C135%2C136%2C160%2C242%2C243%2C244%2C247%2C278%2C298%2C299%2C302%2C303%2C308%2C315&source=youtube&requiressl=yes&mh=7-&mm=31%2C26&mn=sn-gvbxgn-tt1e7%2Csn-vgqsrnl6&ms=au%2Conr&mv=m&mvi=3&pcm2cms=yes&pl=21&ctier=A&pfa=5&initcwndbps=2891250&hightc=yes&siu=1&spc=Ul2Sq7MfoEN0FvcLfEFXce3NlcD6NTutdViV8P26rxDdfFhicZ4s9Qc&vprv=1&svpuc=1&mime=video%2Fwebm&ns=DL4dILfX183VEvBDoLoX8f4O&gir=yes&clen=1480101287&dur=481.614&lmt=1688270362900306&mt=1688334337&fvip=2&keepalive=yes&fexp=24007246&c=WEB&txp=4432434&n=lNwMOTwryhwpT5o&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cctier%2Cpfa%2Chightc%2Csiu%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Cgir%2Cclen%2Cdur%2Clmt&sig=AOq0QJ8wRQIgXz1z1TI6-QKtbiGXyUejH4aPHr9LcZp_YMxSPwvO-f0CIQD8Qzh0rgaQcjG7JrbrGMtfin_Pz0yHNebQjIRDOtgDdg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpcm2cms%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgQnv0qlMAxnFCTqanKhFWzaoJZOz9K5pqHWfTTX92BU8CIQD_YIrgNmXGgqHkngNbIQXGlcLiNEGRE4NDFlsHi_89UQ%3D%3D')

await getDecodedUrl(url).then(url => url.toString()).then(console.log)
