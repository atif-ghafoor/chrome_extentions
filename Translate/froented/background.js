chrome.runtime.onMessage.addListener(reciver);
let textSelected = null;
let languageSelected = null;
async function reciver(request, sender, sendResponse) {
  if (request.action === "text") {
    textSelected = request.message;
  } else if (request.action === "language") {
    languageSelected = request.message;
  }
  if (textSelected && languageSelected) {
    const translation = await getTranslation();
    console.log("translated", translation);
    chrome.runtime.sendMessage({ action: "translation", message: translation });
  }
}

async function getTranslation() {
  try {
    chrome.runtime.sendMessage({ action: "spinner" });
    console.log(textSelected, languageSelected);
    const request = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: textSelected,
        language: languageSelected,
      }),
    });
    const data = await request.json();
    console.log("", data);
    return data;
  } catch (error) {
    console.log("error comes: ", error);
  }
}
