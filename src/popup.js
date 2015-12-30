"use strict";

// style
import '../lib/materialize/css/materialize.min.css';
import '../style/popup.scss';
import Youdao from './util/Youdao';

class Popup {
  static renderResult(resultJson) {
    resultWrapper.innerHTML = require('../tpl/popup-result.jade')(resultJson);
    let addToWordBookAction = document.querySelector('#addToWordBook');
    if(addToWordBookAction) {
      addToWordBookAction.addEventListener('click', (ev) => {
        let word = ev.target.getAttribute('data-word');
        Youdao.addToWordBook(word).then(res => {
          ev.target.textContent = '添加成功';
        }).catch(err => {
        });
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
        Popup.renderResult(data);
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

module.exports = Popup;
Popup.onLoad();
