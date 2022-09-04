import browser from 'webextension-polyfill'

// TODO: Handle quotas
export const getDynamicRules = () => browser.declarativeNetRequest.getDynamicRules()
export const getEnabledRulesets = () => browser.declarativeNetRequest.getEnabledRulesets()
export const getSessionRules = () => browser.declarativeNetRequest.getSessionRules()

export const updateDynamicRules = (options: browser.DeclarativeNetRequest.UpdateDynamicRulesOptionsType) =>
  browser.declarativeNetRequest.updateDynamicRules(options)
export const updateEnabledRulesets = (
  options: browser.DeclarativeNetRequest.UpdateEnabledRulesetsUpdateRulesetOptionsType,
) => browser.declarativeNetRequest.updateEnabledRulesets(options)
export const updateSessionRules = (options: browser.DeclarativeNetRequest.UpdateSessionRulesOptionsType) =>
  browser.declarativeNetRequest.updateSessionRules(options)

export const isRegexSupported = (options: browser.DeclarativeNetRequest.IsRegexSupportedRegexOptionsType) =>
  browser.declarativeNetRequest.isRegexSupported(options)
