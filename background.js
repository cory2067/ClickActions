function newTab(url) {
    chrome.tabs.create({"url": url});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.greeting == "close")
    {
      chrome.tabs.query({ active: true }, function(tabs) {
           chrome.tabs.remove(tabs[0].id);
      });
    }
    else {
      newTab(request.greeting);
    }
  });
