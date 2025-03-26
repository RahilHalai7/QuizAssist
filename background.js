// Keep track of the popup's state
let popupOpen = false;

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openPopup") {
    // Open the popup programmatically
    chrome.action.openPopup(() => {
      if (chrome.runtime.lastError) {
        console.error("Failed to open popup:", chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        popupOpen = true;
        sendResponse({ success: true });
      }
    });
    return true; // Indicates that sendResponse will be called asynchronously
  }

  if (request.action === "isPopupOpen") {
    // Check if the popup is open
    sendResponse({ popupOpen });
  }
});

// Listen for the popup's lifecycle events
chrome.action.onClicked.addListener(() => {
  popupOpen = true;
});

chrome.windows.onRemoved.addListener(() => {
  popupOpen = false;
});