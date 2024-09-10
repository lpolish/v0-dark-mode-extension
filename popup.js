document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('colorModeSelect');

  chrome.storage.local.get('colorMode', function(data) {
    select.value = data.colorMode || 'system';
  });

  select.addEventListener('change', function() {
    const mode = select.value;
    chrome.storage.local.set({colorMode: mode}, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "updateColorMode", mode: mode});
      });
    });
  });
});