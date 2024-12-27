chrome.runtime.onMessage.addListener(reciver);
let textSelected = null;
let languageSelected = "en";
function reciver(request, sender, sendResponse) {
  if (request.action === "text") {
    textSelected = request.message;
  } else if (request.action === "language") {
    languageSelected = request.message;
  }
  if (textSelected && languageSelected) {
    console.log("everything is now seted: ", textSelected, languageSelected);
  }
}
