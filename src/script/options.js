"use strict";

import '../lib/materialize/css/materialize.min.css';
import '../style/options.scss';
import Youdao from './util/youdao';

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
		this.usePersonalKey = document.querySelector('#usePersonalKey');
		this.keyfrom = document.querySelector('input#keyfrom');
		this.key = document.querySelector('input#key');

		chrome.storage.sync.get((items) => {
			this.dblclick.checked = items.dblclick;
			this.shortcut.checked = items.shortcut;
			this.selectToTranslate.checked = items.selectToTranslate;
			this.wordbook.checked = items.wordbook;
      this.usePersonalKey.checked= items.usePersonalKey;
      this.keyfrom.value = items.keyfrom;
      this.key.value = items.key;

			switch (items.shortcut1) {
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

			switch (items.shortcut2) {
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

    this.prevUsePersonalKeyVal = this.usePersonalKey.value;
		this.prevKeyfrom = this.keyfrom.value;
		this.prevKey = this.key.value;
	}

	_saveOptions() {
		let dblclick = this.dblclick.checked;
		let selectToTranslate = this.selectToTranslate.checked;
		let wordbook = this.wordbook.checked;
		let shortcut = this.shortcut.checked;
		let shortcut1 = Object.is(this.shortcut1.keyCode, KEY_CODE['BACKSPACE']) ? null : this.shortcut1.keyCode;
		let shortcut2 = Object.is(this.shortcut2.keyCode, KEY_CODE['BACKSPACE']) ? null : this.shortcut2.keyCode;
		let usePersonalKey = this.usePersonalKey.checked;
    let keyfrom = this.keyfrom.value;
		let key = this.key.value;

		if (usePersonalKey) {
			let reqResult = this._requestKey();
      if (reqResult) {
        reqResult.then(res => {
          chrome.storage.sync.set({
            usePersonalKey,
            keyfrom,
            key
          }, () => {
            Materialize.toast('设置成功', 500);

            this.prevUsePersonalKeyVal = usePersonalKey;
            this.prevKeyfrom = keyfrom;
            this.prevKey = key;
          });
        }).catch(err => {
          usePersonalKey = this.usePersonalKey.checked = false;
          Materialize.toast('设置失败，请检查参数', 1000);
        });
      } else {
        usePersonalKey = this.usePersonalKey.checked = false;
      }
      return;
		} else if (usePersonalKey !== this.prevUsePersonalKeyVal) {
      chrome.storage.sync.set({
        usePersonalKey
      }, () => {
        Materialize.toast('设置成功', 500);
      });
      return;
    }

		chrome.storage.sync.set({
			dblclick,
			selectToTranslate,
			wordbook,
			shortcut,
			shortcut1,
			shortcut2
		}, () => {
			Materialize.toast('设置成功', 500);
		});
	}

	_handleKeyup(ev, ele) {
		switch (ev.keyCode) {
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
		this._saveOptions();
	}

	_requestKey() {
		let keyfrom = this.keyfrom.value;
		let key = this.key.value;

    if (!keyfrom || !key) {
      if (!keyfrom) {
        this.keyfrom.focus();
      } else if (!key) {
        this.key.focus();
      }
      return false;
    } else {
      let [resType, query] = ['json', 'test'];
      let youdao = new Youdao(keyfrom, key, resType, query);

      return youdao.getContent();
    }
	}

  _trimInput(inputEle) {
    if (!inputEle instanceof HTMLInputElement) {
      throw new TypeError('parameter should be instance of HTMLInputElement.');
    }

    inputEle.value = inputEle.value.trim();
  }

  _touchUserKey() {
    let usePersonalKey = this.usePersonalKey.checked = false;

    if (usePersonalKey !== prevUsePersonalKeyVal) {
      chrome.storage.sync.set({
        usePersonalKey
      }, () => {
        this.prevUsePersonalKeyVal = usePersonalKey;
      });
    }
  }

	init() {
		this.shortcut1.addEventListener('click', (ev) => this.shortcut1.select());
		this.shortcut1.addEventListener('keyup', (ev) => this._handleKeyup(ev, shortcut1));
		this.shortcut2.addEventListener('click', (ev) => this.shortcut2.select());
		this.shortcut2.addEventListener('keyup', (ev) => this._handleKeyup(ev, shortcut2));
    this.keyfrom.addEventListener('blur', (ev) => this._trimInput(ev.target));
    this.keyfrom.addEventListener('keydown', this._touchUserKey.bind(this));
    this.key.addEventListener('blur', (ev) => this._trimInput(ev.target));
    this.key.addEventListener('keydown', this._touchUserKey.bind(this));

		Object.keys(this.options).forEach((key) => {
			this.options[key].addEventListener('click', this._saveOptions.bind(this));
		});
	}
}

let options = new Options();
options.init();
