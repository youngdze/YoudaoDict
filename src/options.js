"use strict";

import '../lib/materialize/css/materialize.min.css';

class Options {
  static save_options() {
    let dblclick = document.querySelector('#dblclick').checked;
    let ctrl = document.querySelector('#ctrl').checked;
    chrome.storage.sync.set({
      dblclick: dblclick,
      ctrl: ctrl
    }, function() {
      Materialize.toast('设置成功', 500);
    });
  }

  static restore_options() {
    chrome.storage.sync.get(function(items) {
      document.querySelector('#dblclick').checked = items.dblclick;
      document.querySelector('#ctrl').checked = items.ctrl;
    });
  }
}

{
  document.addEventListener('DOMContentLoaded', Options.restore_options);

  let options = document.querySelectorAll('input[type=checkbox]');
  Object.keys(options).forEach(function(key) {
    // detect if is number
    if (!isNaN(key - 0)) options[key].addEventListener('click', Options.save_options);
  });
}
