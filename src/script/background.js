"use strict";

let defaultOptions = {
  dblclick: true,
  shortcut: true,
  shortcut1: 17,
  shortcut2: null,
  wordbook: false,
  selectoToTranslate: false
};

let init = (details) => {
  if (Object.is(details.reason, 'install'))
    chrome.storage.sync.set(defaultOptions);
};

chrome.runtime.onInstalled.addListener(init);
