chrome.runtime.onMessage.addListener(reciver);
let textSelected = null;
let languageSelected = "en";
async function reciver(request, sender, sendResponse) {
  if (request.action === "text") {
    textSelected = request.message;
  } else if (request.action === "language") {
    languageSelected = request.message;
  }
  if (textSelected && languageSelected) {
    const translation = await getTranslation();
    console.log("translated", translation);
    // chrome.runtime.sendMessage({ action: "translation", message: translation });
  }
}

async function getTranslation() {
  try {
    const request = await fetch("http://localhost:11434/api/generate", {
      method: "post",
      // body: JSON.stringify({
      //   model: "mistral",
      //   prompt: `Translate this '${textSelected}' in ${languageSelected}`,
      //   stream: false,
      // }),
    });
    const data = await request.json();
    console.log("", data);
    return data.translatedText;
  } catch (error) {
    console.log("error comes: ", error);
  }
}
