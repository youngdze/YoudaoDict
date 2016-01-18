"use strict";

let defaultOptions = {
  dblclick: true,
  shortcut: true,
  shortcut1: 17,
  shortcut2: null,
  wordbook: false
};

let addYoudaoDict = function(tab) {
  chrome.tabs.executeScript(tab.id, {
    file: "js/popover.js",
    allFrame: true
  });
  chrome.tabs.insertCSS(tab.id, {
    file: "css/popover.css",
    allFrame: true
  });
};

let init = function(details) {
  if (Object.is(details.reason, 'install')) {
    chrome.storage.sync.set(defaultOptions);
    // chrome.tab.query({}, (tabs) => tabs.forEach(addYoudaoDict));
  }
};

chrome.runtime.onInstalled.addListener(init);