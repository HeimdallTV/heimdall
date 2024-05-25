import { createStorageProvider, memoizeAsync } from '@libs/cache'
import { fetchBaseJS } from './shared'

const getNParamDecodingFunction = memoizeAsync(
  async (): Promise<string> => {
    const baseJS = await fetchBaseJS()
    const nameOfConsumerFunction = baseJS.match(/\.get\("n"\).+?(\w+)\[\d+\]\(\w+?\)/)![1]
    const nameOfWrapperFunction = baseJS.match(new RegExp(`${nameOfConsumerFunction}=\\[(\\w+?)\\]`))![1]
    const functionBody = baseJS.match(
      new RegExp(`${nameOfWrapperFunction}=(function\\(.+?\\){[^]+?};)\\n?.+?=function`),
    )![1]
    return functionBody
  },
  { provider: createStorageProvider('YT_N_PARAM_DECODING_FUNCTION'), timeout: 1000 * 60 * 60 * 24 },
)

export async function getDecodedNParam(n: string): Promise<string> {
  const functionBody = await getNParamDecodingFunction()
  // FIXME: Using temporarily until the sandboxed code is sped up
  // biome-ignore lint/security/noGlobalEval: we need to eval the function to decode the signature
  return eval(`(${functionBody.slice(0, -1)})("${n}")`)
  // return runSandboxedCode(`(${functionBody.slice(0, -1)})("${n}")`)
}

// TODO: Adds 100ms on load because we run this 30 times. Ideally re-use the same iframe for all of them
async function runSandboxedCode(code: string): Promise<string> {
  const iframe = document.createElement('iframe')
  iframe.style.setProperty('display', 'none', 'important')
  iframe.setAttribute('sandbox', 'allow-scripts') // Ensure the iframe is sandboxed

  return new Promise((resolve, reject) => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.source === iframe.contentWindow) {
        // Get the result from the iframe
        const result = event.data

        // Handle the result
        if (typeof result === 'object' && 'error' in result && typeof result.error === 'string') {
          reject(Error(result.error))
        } else if (result !== undefined) {
          resolve(result)
        } else {
          reject(Error('Received unknown error from sandboxed code'))
        }

        document.body.removeChild(iframe)

        // Remove the event listener
        window.removeEventListener('message', receiveMessage)
      }
    }
    window.addEventListener('message', receiveMessage)

    // TODO: Escape the code string
    // Set the iframe's content and append it to the document
    iframe.srcdoc = `
      <script>
      try {
        const result = ${code};
        // Send the result to the parent window
        window.parent.postMessage(result, '*');
      } catch (error) {
        // Send the error message to the parent window
        window.parent.postMessage({ error: error.message }, '*');
      }
      </script>
    `
    document.body.appendChild(iframe)
  })
}
