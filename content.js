//By Rahil Halai.
console.log("content.js is running!");
console.log("QuizAssist is running!");

const apiKey = "YOUR_GEMINI_API_KEY"; // Replace this with your actual Gemini API key, there are free api keys available as of 23rd-March-25'
//R7.
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//Call Gemini API to summarize code.
async function summarizeCode(code) {
  if (!apiKey) {
    console.error("API key missing! Please ensure it's securely provided.");
    return "Error: Missing API key.";
  }

  // const prompt1 = "Please, Detect what language this code is in and reply in a single sentence:";
  // const prompt2 = "Detect if this code , if YES: (refrain from answering whether this is code or not), start with the title --Summary-- and provide a concise three-sentence summary and then mention --Output-- and the general calculation and output of the following code in formatted english where it can presented to a user with humanlike but formal language and not random symbols, also don't use ```.:";
  const prompt = "Answer this question (and IF AND ONLY IF it has an option number please include it as well), IMPORTANT: also clean up the answer as it is to be shown as an output hence no uses of * or ` when not necessary: ";
  //const prompt = "";
  
  const input = prompt + code;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: input,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Full API response data:", JSON.stringify(data));

    // Check for errors in API response
    if (data.error) {
      console.error("API error:", data.error);
      return "Error from API: " + data.error.message;
    }

    // Extract summary from the response
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }

    return "No meaningful answer received from API.";

  } 
  catch (error) {
    console.error("Error answering question:", error);
    return "Error occurred during answering.";
  }
}

//Clean and validate the summary content.
function cleanSummary(summary) {
  return summary && summary.trim().length > 0
    ? summary.trim()
    : "Failed to generate a meaningful answer.";
}


//Handle text selection and API calls.
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) {
    console.log("No text selected.");
    return;
  }

  console.log("Selected text:", selectedText);

  // // Check if the selection appears to be CODE
  // const codeIndicators = /[{}<>();]/;
  // if (codeIndicators.test(selectedText)) {
  //   console.log("Selected text does not look like code.");
  //   return;
  // }

  // console.log("Code detected. Preparing to summarize...");


  // Notify extension popup
  //const { success } = await chrome.runtime.sendMessage({ action: "openPopup" });
  // if (!success) {
  //   console.error("Failed to open popup.");
  //   return;
  // }

  await chrome.runtime.sendMessage({ action: "openPopup" });

  await chrome.runtime.sendMessage({ action: "showLoading" });

  const summary = await summarizeCode(selectedText);
  const cleanOutput = cleanSummary(summary);

  console.log("Answer received:", cleanOutput);

  await chrome.runtime.sendMessage({
    action: "displaySummary",
    summary: cleanOutput,
  });
});