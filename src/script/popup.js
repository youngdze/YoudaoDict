"use strict";

import '../lib/materialize/css/materialize.min.css';
import '../style/popup.scss';
import Youdao from './util/youdao';

class Popup {
  static keyfrom = 'YoungdzeBlog';
  static key = 498418215;

  static renderResult(resultJson) {
    resultWrapper.innerHTML = require('../tpl/popup-result.jade')(resultJson);
    Popup.audioPlay();
    Popup.addToWordBook();
    Popup.displayMore();
  }

  static processInput(queryInput) {
    let [from, resType, query, youdaoKey] = [Popup.keyfrom, 'json', window.getSelection().toString().trim(), Popup.key];
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
        Popup.renderResult({
          word: query,
          loading: false,
          error: err
        });
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
        let spinner = document.querySelector('#ySpinner');
        spinner.className = spinner.className.replace(' hide', '');
        Youdao.addToWordBook(word).then(res => {
          if(res.added) {
            ev.target.setAttribute('data-add-status', added);
            ev.target.textContent = addToWordBookSuccessText;
          }
          spinner.className += ' hide';
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

  static init() {
    chrome.storage.sync.get(items => {
      if (items.usePersonalKey) {
        Popup.keyfrom = items.keyfrom || Popup.keyfrom;
        Popup.key = items.key || Popup.key;
      }
    });
  }

  static onLoad() {
    Popup.init();

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

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      Popup.processInput(queryInput);
    });
  }
}

export default Popup;
Popup.onLoad();
