"use strict";

import '../lib/materialize/css/materialize.min.css';
import '../style/options.scss';

const KEY_CODE = {
  BACKSPACE: 8,
  CTRL: 17,
  SHIFT: 16,
  ALT: 18,
  CMD: 91
};

class Options {
  constructor() {
    this.options = document.querySelectorAll('input[type=checkbox]');
    this.dblclick = document.querySelector('#dblclick');
    this.shortcut = document.querySelector('#shortcut');
    this.shortcut1 = document.querySelector('#shortcut1');
    this.shortcut2 = document.querySelector('#shortcut2');
    this.selectToTranslate = document.querySelector('#selectToTranslate');
    this.wordbook = document.querySelector('#wordbook');

    chrome.storage.sync.get((items) => {
      this.dblclick.checked = items.dblclick;
      this.shortcut.checked = items.shortcut;
      this.selectToTranslate.checked = items.selectToTranslate;
      this.wordbook.checked = items.wordbook;

      switch(items.shortcut1) {
        case KEY_CODE['CTRL']:
          this.shortcut1.value = 'CTRL';
          break;
        case KEY_CODE['SHIFT']:
          this.shortcut1.value = 'SHIFT';
          break;
        case KEY_CODE['ALT']:
          this.shortcut1.value = 'ALT';
          break;
        default:
          this.shortcut1.value = String.fromCharCode(items.shortcut1).toUpperCase();
      }

      switch(items.shortcut2) {
        case KEY_CODE['CTRL']:
          this.shortcut2.value = 'CTRL';
          break;
        case KEY_CODE['SHIFT']:
          this.shortcut2.value = 'SHIFT';
          break;
        case KEY_CODE['ALT']:
          this.shortcut2.value = 'ALT';
          break;
        case KEY_CODE['CMD']:
          this.shortcut2.value = 'CMD';
          break;
        default:
          this.shortcut2.value = String.fromCharCode(items.shortcut2).toUpperCase();
      }
    });
  }

  saveOptions() {
    let dblclick = this.dblclick.checked;
    let selectToTranslate = this.selectToTranslate.checked;
    let wordbook = this.wordbook.checked;
    let shortcut = this.shortcut.checked;
    let shortcut1 = Object.is(this.shortcut1.keyCode, KEY_CODE['BACKSPACE']) ? null : this.shortcut1.keyCode;
    let shortcut2 = Object.is(this.shortcut2.keyCode, KEY_CODE['BACKSPACE']) ? null : this.shortcut2.keyCode;
    chrome.storage.sync.set({dblclick, selectToTranslate, wordbook, shortcut, shortcut1, shortcut2}, () => {
      Materialize.toast('设置成功', 500);
    });
  }

  handleKeyup(ev, ele) {
    switch(ev.keyCode) {
      case KEY_CODE['BACKSPACE']:
        ele.value = '';
        break;
      case KEY_CODE['CTRL']:
        ele.value = 'CTRL';
        break;
      case KEY_CODE['ALT']:
        ele.value = 'ALT';
        break;
      case KEY_CODE['SHIFT']:
        ele.value = 'SHIFT';
        break;
      case KEY_CODE['CMD']:
        ele.value = 'CMD';
        break;
      default:
        ele.value = String.fromCharCode(ev.keyCode);
        break;
    }
    ele.keyCode = ev.keyCode;
    this.saveOptions();
  }

  init() {
    this.shortcut1.addEventListener('click', (ev) => this.shortcut1.select());
    this.shortcut1.addEventListener('keyup', (ev) => this.handleKeyup(ev, shortcut1));
    this.shortcut2.addEventListener('click', (ev) => this.shortcut2.select());
    this.shortcut2.addEventListener('keyup', (ev) => this.handleKeyup(ev, shortcut2));

    Object.keys(this.options).forEach((key) => {
      this.options[key].addEventListener('click', this.saveOptions.bind(this));
    });
  }
}

let options = new Options();
options.init();
