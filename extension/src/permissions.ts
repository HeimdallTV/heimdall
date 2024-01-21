import browser from 'webextension-polyfill'

const button = document.getElementById('request')!
button.addEventListener('click', async () => {
  const manifest = browser.runtime.getManifest()
  const origins = manifest.host_permissions!

  const granted = await browser.permissions.request({ origins })
  if (granted) {
    browser.tabs.remove(await browser.tabs.getCurrent().then((tab) => tab.id!))
  }
})
