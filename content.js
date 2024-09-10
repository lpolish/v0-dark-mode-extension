function applyGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    body.v0-dark-mode {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
    }
    body.v0-dark-mode .bg-white,
    body.v0-dark-mode [class*="bg-gray-"],
    body.v0-dark-mode [class*="bg-slate-"] {
      background-color: #2a2a2a !important;
    }
    body.v0-dark-mode .text-gray-900,
    body.v0-dark-mode .text-gray-800,
    body.v0-dark-mode .text-gray-700,
    body.v0-dark-mode .text-gray-600,
    body.v0-dark-mode .text-gray-500,
    body.v0-dark-mode .text-slate-900,
    body.v0-dark-mode .text-slate-800,
    body.v0-dark-mode .text-slate-700,
    body.v0-dark-mode .text-slate-600,
    body.v0-dark-mode .text-slate-500,
    body.v0-dark-mode .text-black,
    body.v0-dark-mode .prose {
      color: #e0e0e0 !important;
    }
    body.v0-dark-mode .border-gray-200,
    body.v0-dark-mode .border-slate-200 {
      border-color: #444 !important;
    }
    body.v0-dark-mode input,
    body.v0-dark-mode textarea {
      background-color: #333 !important;
      color: #e0e0e0 !important;
      border-color: #555 !important;
    }
    body.v0-dark-mode button {
      background-color: #444 !important;
      color: #e0e0e0 !important;
    }
    body.v0-dark-mode a {
      color: #3b82f6 !important;
    }
    body.v0-dark-mode pre,
    body.v0-dark-mode code {
      background-color: #1e1e1e !important;
      color: #d4d4d4 !important;
    }
    body.v0-dark-mode .token.punctuation {
      color: #d4d4d4 !important;
    }
    body.v0-dark-mode .token.keyword {
      color: #569cd6 !important;
    }
    body.v0-dark-mode .token.string {
      color: #ce9178 !important;
    }
    body.v0-dark-mode .token.comment {
      color: #6a9955 !important;
    }
    body.v0-dark-mode .token.function {
      color: #dcdcaa !important;
    }
    body.v0-dark-mode .token.number {
      color: #b5cea8 !important;
    }
    body.v0-dark-mode .token.operator {
      color: #d4d4d4 !important;
    }
    body.v0-dark-mode .token.class-name {
      color: #4ec9b0 !important;
    }
    body.v0-dark-mode :not(pre) > code {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
    }
    body.v0-dark-mode .prose :not(pre) > code {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
    }

    /* Updated gradient styles for dark mode */
    body.v0-dark-mode [class*="from-"],
    body.v0-dark-mode [class*="to-"],
    body.v0-dark-mode [class*="via-"] {
      --tw-gradient-from: #2a2a2a !important;
      --tw-gradient-to: #2a2a2a !important;
      --tw-gradient-stops: #2a2a2a !important;
    }
    body.v0-dark-mode .bg-gradient-to-r,
    body.v0-dark-mode .bg-gradient-to-l,
    body.v0-dark-mode .bg-gradient-to-t,
    body.v0-dark-mode .bg-gradient-to-b {
      background-image: none !important;
      background-color: #2a2a2a !important;
    }
    body.v0-dark-mode .bg-blend-lighten {
      background-blend-mode: normal !important;
    }
    
    /* Scroll bar styling for WebKit browsers (Chrome, Safari, newer versions of Edge) */
    body.v0-dark-mode ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    body.v0-dark-mode ::-webkit-scrollbar-track {
      background: #2a2a2a;
    }
    body.v0-dark-mode ::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 6px;
      border: 3px solid #2a2a2a;
    }
    body.v0-dark-mode ::-webkit-scrollbar-thumb:hover {
      background-color: #666;
    }

    /* Scroll bar styling for Firefox */
    body.v0-dark-mode * {
      scrollbar-color: #555 #2a2a2a;
      scrollbar-width: thin;
    }
  `;
  document.head.appendChild(style);
}

function applyColorMode(mode) {
  if (mode === 'system') {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('v0-dark-mode', isDarkMode);
  } else {
    document.body.classList.toggle('v0-dark-mode', mode === 'dark');
  }
}

function observeDOMChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            chrome.storage.local.get('colorMode', (result) => {
              applyColorMode(result.colorMode);
            });
          }
        });
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    console.warn('Document body not found. Observer not attached.');
  }
}

function init() {
  chrome.storage.local.get('colorMode', (result) => {
    const colorMode = result.colorMode || 'system';
    applyColorMode(colorMode);
    observeDOMChanges();
    applyGlobalStyles();
  });
}

// Ensure the DOM is fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateColorMode") {
    applyColorMode(request.mode);
  }
});