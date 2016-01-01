"use strict";

import '../lib/materialize/sass/materialize.scss';
import '../style/popup.scss';
import Youdao from './util/youdao';

class Popup {
  static renderResult(resultJson) {
    resultWrapper.innerHTML = require('../tpl/popup-result.jade')(resultJson);

    let audioAction = document.querySelector('#wav'),
      addToWordBookAction = document.querySelector('#addToWordBook'),
      moreAction = document.querySelector('#more');

    if(audioAction) {
      audioAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        let audioNode = document.querySelector('#audio');
        audioNode.src = resultJson.wav;
        audioNode.play();
      });
    }

    if(addToWordBookAction) {
      addToWordBookAction.addEventListener('click', (ev) => {
        let word = ev.target.getAttribute('data-word');
        Youdao.addToWordBook(word).then(res => {
          ev.target.textContent = '添加成功';
        }).catch(err => {
        });
      });
    }

    if(moreAction) {
      moreAction.addEventListener('click', (ev) => {
        if(chrome && chrome.tabs) {
          chrome.tabs.create({url: resultJson.more});
        } else {
          window.open(resultJson.more, '_blank');
        }
      });
    }
  }

  static processResult(queryInput) {
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

  static onLoad() {
    let form = document.forms.namedItem('dictForm');
    let queryInput = form.query;
    let timeout;
    queryInput.focus();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      Popup.processResult(queryInput);
    });

    queryInput.addEventListener('keyup', (ev) => {
      if (Object.is(ev.keyCode, 13)) return;
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      timeout = setTimeout(() => {
        Popup.processResult(queryInput);
      }, 700);
    });
  }
}

export default Popup;
Popup.onLoad();
