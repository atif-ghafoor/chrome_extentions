console.log("background is running");

chrome.browserAction.onClicked.addListener(buttonClicked);
let clicked = false;

function buttonClicked(tabs) {
  clicked = !clicked;
  chrome.tabs.sendMessage(tabs.id, clicked);
}
