chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ colorMode: 'system' });
});