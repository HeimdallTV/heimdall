import esbuild from 'esbuild'
import { copyFile, readFile, watch, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
const { values: args } = parseArgs({ args: process.argv.slice(2), strict: false })

const buildContext = (outdir) =>
  esbuild.context({
    entryPoints: ['src/service-worker.ts', 'src/content-script.ts', 'src/permissions.ts'],
    outdir,
    bundle: true,
    sourcemap: true,
  })

async function buildManifest(inFile, outFile) {
  const inManifest = await readFile(inFile, 'utf-8').then(JSON.parse)
  const packageJson = await readFile('package.json', 'utf-8').then(JSON.parse)
  const contentScriptMatch = args.mode === 'release' ? 'https://heimdall.tv/*' : 'http://localhost/*'
  const outManifest = {
    ...inManifest,
    name: 'Heimdall',
    version: packageJson.version,
    host_permissions: [...inManifest.host_permissions, contentScriptMatch],
    content_scripts: [
      {
        matches: [contentScriptMatch],
        js: ['content-script.js'],
        run_at: 'document_start',
      },
    ],
  }
  await writeFile(outFile, JSON.stringify(outManifest, null, 2))
}

// Build
const chromeCtx = await buildContext('build/chrome')
const firefoxCtx = await buildContext('build/firefox')
const build = () =>
  Promise.all([
    chromeCtx
      .rebuild()
      .then(() => buildManifest('src/manifest.chrome.json', 'build/chrome/manifest.json'))
      .then(() => copyFile('src/permissions.html', 'build/chrome/permissions.html')),
    firefoxCtx
      .rebuild()
      .then(() => buildManifest('src/manifest.firefox.json', 'build/firefox/manifest.json'))
      .then(() => copyFile('src/permissions.html', 'build/firefox/permissions.html')),
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
