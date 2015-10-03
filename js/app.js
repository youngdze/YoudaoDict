'use strict';

let Bubble = require('./bubble.js');

{
    chrome.storage.sync.get(function( items ){
        if(items.dblclick) Bubble.enableDblclick();
        if(items.ctrl) Bubble.enableKeydown();
    })
}