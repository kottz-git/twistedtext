if (typeof browser !== 'undefined') {
    // For Firefox and other browsers
    browser.browserAction.onClicked.addListener((tab) => {
        // Open the debug.html page in a new tab
        browser.tabs.create({ url: browser.runtime.getURL('debug.html') });
    });
} else if (typeof chrome !== 'undefined') {
    // For Chrome
    chrome.action.onClicked.addListener((tab) => {
        // Open the debug.html page in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('debug.html') });
    });
}
