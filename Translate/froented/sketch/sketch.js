async function setup() {
  noCanvas();
  // for checking if user open api key is there or not
  const apiKeyBox = document.querySelector("#api_key_box");
  let userOpenAiApiKey = localStorage.getItem("apiKey");
  if (userOpenAiApiKey) {
    apiKeyBox.style.display = "none";
  } else {
    apiKeyBox.style.display = "flex";
  }

  // add user open api key when user click on add
  const apiKeyAddButton = document.querySelector("#api_key_button");
  const apiKeyInput = document.querySelector("#api_key_input");
  const translationBox = document.querySelector("#translation-box");
  apiKeyAddButton.addEventListener("click", () => {
    const key = apiKeyInput.value;
    validateOpenAIKey(key).then((valid) => {
      if (valid) {
        localStorage.setItem("apiKey", key);
        apiKeyBox.style.display = "none";
        translationBox.textContent =
          "Your Api key is successfully added, now select text from page to Translate";
      } else {
        translationBox.textContent = "Your Api Key is Invalid!";
      }
    });
  });

  let selctedLanguage = localStorage.getItem("language");
  if (!selctedLanguage) {
    localStorage.setItem("language", "English");
    selctedLanguage = localStorage.getItem("language");
  }
  chrome.runtime.sendMessage({
    action: "language",
    message: localStorage.getItem("language"),
  });
  const dropDownButton = document.querySelector("#selected-language");
  const button = dropDownButton.querySelector("span");
  button.textContent = selctedLanguage;
  let displayLanguages = false;
  const listLanguages = await getLIstOfLanguages();
  const languageContainer = document.querySelector("#languages");
  listLanguages.forEach((language) => {
    const div = `<div id="${language.code}" class="${language.name}">${language.name}</div>`;
    languageContainer.innerHTML += div;
  });
  dropDownButton.addEventListener("click", dropDownClick);
  function dropDownClick() {
    console.log("drop down clicked", displayLanguages);
    if (displayLanguages) {
      languageContainer.style["display"] = "none";
    } else {
      languageContainer.style["display"] = "flex";
    }
    displayLanguages = !displayLanguages;
  }
  const languageElements = languageContainer.querySelectorAll("div");
  if (languageElements) {
    languageElements.forEach((language) => {
      language.addEventListener("click", function () {
        button.textContent = language.textContent;
        chrome.runtime.sendMessage({
          action: "language",
          message: language.textContent,
        });
        languageContainer.style["display"] = "none";
        displayLanguages = !displayLanguages;
        localStorage.removeItem("language");
        localStorage.setItem("language", language.textContent);
      });
    });
  }
}
chrome.runtime.onMessage.addListener(reciver);
function reciver(request, sender, sendResponse) {
  const translationBox = document.querySelector("#translation-box");
  if (request.action === "translation") {
    hideLoader();
    translationBox.textContent = request.message;
  } else if (request.action === "spinner") {
    showLoader();
  }
}
async function getLIstOfLanguages() {
  const request = await fetch("https://libretranslate.com/languages");
  const data = await request.json();
  return data;
}

//  check user inputing validate api key

async function validateOpenAIKey(apiKey) {
  const testPrompt = "This is a test prompt."; // A small prompt for testing
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // OpenAI API endpoint

  try {
    showLoader();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Use the provided API key
      },
      body: JSON.stringify({
        model: "gpt-4", // or "gpt-4" for better translations
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: testPrompt,
          },
        ],
        max_tokens: 5, // Keep token usage minimal for testing
      }),
    });
    hideLoader();
    if (response.ok) {
      console.log("API key is valid!");
      return true; // The API key is valid
    } else {
      const errorData = await response.json();
      console.error("API key is invalid:", errorData);
      return false; // The API key is invalid
    }
  } catch (error) {
    console.error("Error validating API key:", error);
    return false; // An error occurred during validation
  }
}

function showLoader() {
  const spinnerBox = document.querySelector("#loader");
  const translationBox = document.querySelector("#translation-box");
  translationBox.style.display = "none";
  spinnerBox.style.display = "flex";
}
function hideLoader() {
  const spinnerBox = document.querySelector("#loader");
  const translationBox = document.querySelector("#translation-box");
  spinnerBox.style.display = "none";
  translationBox.style.display = "";
}
