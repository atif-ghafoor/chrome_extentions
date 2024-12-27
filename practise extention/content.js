console.log("extention is running?");

chrome.runtime.onMessage.addListener(messageReciver);

function messageReciver(message, sender, sendResponse) {
  console.log(message);
  const paraElements = document.querySelectorAll("p");
  for (elt of paraElements) {
    elt.innerHTML = message;
  }
}
