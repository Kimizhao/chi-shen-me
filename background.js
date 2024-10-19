chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'openPopup') {
    chrome.windows.getCurrent(function(currentWindow) {
      const width = 400;
      const height = 600;
      const left = currentWindow.left + Math.round((currentWindow.width - width) / 2);
      const top = currentWindow.top + Math.round((currentWindow.height - height) / 2);

      chrome.windows.create({
        url: chrome.runtime.getURL('popup.html'),
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
      });
    });
  }
});