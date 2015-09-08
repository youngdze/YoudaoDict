"use strict";

let defaultOptions = {
    dblclick: true,
    ctrl: true
};

chrome.runtime.onInstalled.addListener(init);

function init(details) {
    if (details.reason === 'install') {
        chrome.storage.sync.set(defaultOptions);
        chrome.tab.query({}, function (tabs) {
            tabs.forEach(addYoudaoDict);
        });
    }
}

function addYoudaoDict(tab) {
    chrome.tabs.executeScript(tab.id, {
        file: "js/popover.js",
        allFrame: true
    });
    chrome.tabs.insertCSS(tab.id, {
        file: "css/popover.css",
        allFrame: true
    })
}