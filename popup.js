// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showLoading") {
    const loadingElement = document.getElementById("loading");
    loadingElement.style.display = "block"; // Show loading state
    sendResponse({ success: true }); // Acknowledge the message
  }

  if (request.action === "displaySummary") {
    const summaryElement = document.getElementById("summary");
    const loadingElement = document.getElementById("loading");

    if (request.summary) {
      const formattedSummary = request.summary.replace(/\n/g, "<br>");
      // Hide loading and show summary
      loadingElement.style.display = "none";
      summaryElement.innerHTML = `<p>${formattedSummary}</p>`;
    } else {
      // Hide loading and show error message
      loadingElement.style.display = "none";
      summaryElement.innerHTML = `<p class="placeholder">Unable to generate a correct answer. Please try again in a few minutes.</p>`;
    }
    sendResponse({ success: true }); // Acknowledge the message
  }

  return true; // Indicates that sendResponse will be called asynchronously
});

// Function to resize the popup based on content
function resizePopup() {
  const summaryBox = document.getElementById("summary");
  const height = summaryBox.scrollHeight + 100; // Add extra padding
  const width = 400; // Fixed width or calculate dynamically
  window.resizeTo(width, height);
}