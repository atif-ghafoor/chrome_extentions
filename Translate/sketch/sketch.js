async function setup() {
  noCanvas();
  let selctedLanguage = localStorage.getItem("language");
  if (!selctedLanguage) {
    localStorage.setItem("language", "English");
    selctedLanguage = localStorage.getItem("language");
  }
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
          message: language.id,
        });
        languageContainer.style["display"] = "none";
        displayLanguages = !displayLanguages;
        localStorage.removeItem("language");
        localStorage.setItem("language", language.textContent);
      });
    });
  }
}
async function getLIstOfLanguages() {
  const request = await fetch("https://libretranslate.com/languages");
  const data = await request.json();
  return data;
}
