"use strict";

{
  let modules = {};

  modules.save_options = function(){
    let dblclick = document.querySelector('#dblclick').checked;
    let ctrl = document.querySelector('#ctrl').checked;
    chrome.storage.sync.set({
      dblclick:dblclick,
      ctrl    :ctrl
    }, function(){
      Materialize.toast('设置成功', 500);
    });
  };

  modules.restore_options = function(){
    chrome.storage.sync.get(function( items ){
      document.querySelector('#dblclick').checked = items.dblclick;
      document.querySelector('#ctrl').checked = items.ctrl;
    });
  };

  {
    document.addEventListener('DOMContentLoaded', modules.restore_options);

    let options = document.querySelectorAll('input[type=checkbox]');
    Object.keys(options).map(function( key ){
      // detect if is number
      if(!isNaN(key - 0)) options[key].addEventListener('click', modules.save_options);
    });
  }
}
