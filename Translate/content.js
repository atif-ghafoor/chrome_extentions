window.addEventListener("mouseup", getSelctedWord);

function getSelctedWord() {
  const selctedText = window.getSelection().toString();
  if (selctedText.length > 0) {
    console.log(selctedText, selctedText.length);
    chrome.runtime.sendMessage({ action: "text", message: selctedText });
  }
}
