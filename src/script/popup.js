"use strict";

import '../lib/materialize/sass/materialize.scss';
import '../style/popup.scss';
import Youdao from './util/youdao';

class Popup {
  static renderResult(resultJson) {
    resultWrapper.innerHTML = require('../tpl/popup-result.jade')(resultJson);
    Popup.audioPlay();
    Popup.addToWordBook();
    Popup.displayMore();
  }

  static processInput(queryInput) {
    let [from, resType, query, youdaoKey] = ['YoungdzeBlog', 'json', window.getSelection().toString().trim(), 498418215];
    query = queryInput.value;
    if (!query) return;
    Popup.renderResult({loading: true});

    let youdao = new Youdao(from, youdaoKey, resType, query);
    youdao.getContent()
      .then(data => {
        data.loading = false;
        chrome.storage.sync.get(items => {
          data.wordbook = items.wordbook;
          Popup.renderResult(data);
        });
      }).catch(err => {
        Popup.renderResult({loading: false, error: err});
      });
  }

  static audioPlay() {
    let audioAction = document.querySelector('#wav');
    if(audioAction) {
      audioAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        let audioNode = document.querySelector('#audio');
        audioNode.play();
      });
    }
  }

  static addToWordBook() {
    const addToWordBookSuccessText = '添加成功';
    const added = 'added';

    let addToWordBookAction = document.querySelector('#addToWordBook');
    if(addToWordBookAction) {
      addToWordBookAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        if(Object.is(ev.target.getAttribute('data-add-status'), added)) return;
        let word = ev.target.getAttribute('data-word');
        Youdao.addToWordBook(word).then(res => {
          ev.target.setAttribute('data-add-status', added);
          ev.target.textContent = addToWordBookSuccessText;
        }).catch(err => {});
      });
    }
  }

  static displayMore() {
    let moreAction = document.querySelector('#more');
    if(moreAction) {
      let moreUrl = moreAction.getAttribute('data-more');
      moreAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        if(chrome && chrome.tabs) {
          chrome.tabs.create({url: moreUrl});
        } else {
          window.open(resultJson.more, '_blank');
        }
      });
    }
  }

  static onLoad() {
    let form = document.forms.namedItem('dictForm');
    let queryInput = form.query;
    let timeout;
    queryInput.focus();

    queryInput.addEventListener('keyup', (ev) => {
      if (Object.is(ev.keyCode, 13)) return;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(() => {
        Popup.processInput(queryInput);
      }, 700);
    });
  }
}

export default Popup;
Popup.onLoad();
