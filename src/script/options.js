"use strict";

import '../lib/materialize/sass/materialize.scss';

class Options {
  static save_options() {
    let dblclick = document.querySelector('#dblclick').checked;
    let ctrl = document.querySelector('#ctrl').checked;
    let wordbook = document.querySelector('#wordbook').checked;
    chrome.storage.sync.set({dblclick, ctrl, wordbook}, () => {
      Materialize.toast('设置成功', 500);
    });
  }

  static restore_options() {
    chrome.storage.sync.get((items) => {
      document.querySelector('#dblclick').checked = items.dblclick;
      document.querySelector('#ctrl').checked = items.ctrl;
      document.querySelector('#wordbook').checked = items.wordbook;
    });
  }
}

{
  document.addEventListener('DOMContentLoaded', Options.restore_options);

  let options = document.querySelectorAll('input[type=checkbox]');
  Object.keys(options).forEach((key) => {
    options[key].addEventListener('click', Options.save_options);
  });
}
