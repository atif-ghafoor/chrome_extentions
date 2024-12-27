function setup() {
  noCanvas();
  let userInput = select("#userInput");
  userInput.input(newText);
  function newText() {
    const tabsQuery = {
      active: true,
      currentWindow: true,
    };
    chrome.tabs.query(tabsQuery, goToTab);
    function goToTab(tabs) {
      let message = userInput.value();
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  }
}
