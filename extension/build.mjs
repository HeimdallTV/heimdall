import esbuild from 'esbuild'
import { readFile, watch, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
const { values: args } = parseArgs({ args: process.argv.slice(2), strict: false })

const buildContext = (outdir) =>
  esbuild.context({
    entryPoints: ['src/service-worker.ts', 'src/content-script.ts'],
    outdir,
    bundle: true,
    sourcemap: true,
  })

const buildManifest = (inFile, outFile) =>
  readFile(inFile, 'utf-8')
    .then((contents) => JSON.parse(contents))
    .then((manifest) => ({
      ...manifest,
      content_scripts: [
        {
          matches: [args.mode === 'release' ? 'https://heimdall.tv/*' : 'http://localhost:3000/*'],
          js: ['content-script.js'],
          run_at: 'document_start',
        },
      ],
    }))
    .then((manifest) => JSON.stringify(manifest, null, 2))
    .then((contents) => writeFile(outFile, contents))

// Build
const chromeCtx = await buildContext('build/chrome')
const firefoxCtx = await buildContext('build/firefox')
const build = () =>
  Promise.all([
    chromeCtx.rebuild().then(() => buildManifest('src/manifest.chrome.json', 'build/chrome/manifest.json')),
    firefoxCtx
      .rebuild()
      .then(() => buildManifest('src/manifest.firefox.json', 'build/firefox/manifest.json')),
  ])
await build()

// Watch for changes
if (args.watch) {
  console.log('Initial build complete')
  console.log('Watching for changes...')
  for await (const _ of watch('src', { recursive: true })) {
    console.log('Rebuilding...')
    await build()
    console.log('Watching for changes...')
  }
}
// Or exit
else {
  chromeCtx.dispose()
  firefoxCtx.dispose()
}
