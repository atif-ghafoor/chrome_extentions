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
    apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      chrome.runtime.sendMessage({ action: "empty-api-key" });
    }
    const translation = await translateTextFromOpenAi(apiKey);
    console.log("translated", translation);
    chrome.runtime.sendMessage({ action: "translation", message: translation });
  }
}

async function translateTextFromOpenAi(apiKey) {
  try {
    chrome.runtime.sendMessage({ action: "spinner" });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-4" for better translations
        messages: [
          {
            role: "system",
            content: "You are a professional translator.",
          },
          {
            role: "user",
            content: `Translate this: '${textSelected}' into ${languageSelected}. Only provide the translation text, no extra information.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.2,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("response", data);
      const translatedText = data.choices[0].message.content;
      return translatedText;
    } else {
      const errorData = await response.json();
      console.error("error comes while translating:", errorData);
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}
