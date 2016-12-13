"use strict";

import '../style/bubble.scss';
import Youdao from './util/youdao';

class Bubble {
  static keyfrom = 'YoungdzeBlog';
  static key = 498418215;

  static renderBubble(tpl) {
    if (document.querySelector('#y-bubble')) {
      let unnecessaryBubble = document.querySelector('#y-bubble');
      unnecessaryBubble.parentNode.removeChild(unnecessaryBubble);
    }

    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();
    let bubbleLeft, bubbleTop, arrowRelativeLeft;

    let dummy = document.createElement('DIV');
    dummy.innerHTML = tpl.trim();
    let dummyChild = dummy.childNodes;
    document.body.appendChild(dummyChild[0]);

    let bubble = document.querySelector('#y-bubble');

    bubbleLeft = rect.left + rect.width / 2 - bubble.offsetWidth / 2;

    if (bubbleLeft < 5) {
      bubbleLeft = 5;
      arrowRelativeLeft = rect.left + rect.width / 2 - 15;
    } else if ((bubbleLeft + bubble.offsetWidth) > (document.body.offsetWidth + 5)) {
      bubbleLeft = document.body.offsetWidth - bubble.offsetWidth - 5;
      arrowRelativeLeft = rect.left - bubbleLeft - 10 + rect.width / 2;
    } else {
      arrowRelativeLeft = bubble.offsetWidth / 2 - 10;
    }

    if (rect.top < bubble.offsetHeight) {
      bubbleTop = rect.top + window.scrollY + rect.height + 10;

      let bubbleArrow = document.querySelector('#y-arrow');
      bubbleArrow.style.borderBottom = '10px solid rgba(13, 13, 13, .8)';
      bubbleArrow.style.borderTop = 0;
      bubbleArrow.style.top = '-10px';
      bubbleArrow.style.left = `${arrowRelativeLeft}px`;
    } else {
      bubbleTop = rect.top + window.scrollY - bubble.offsetHeight - 10;

      let bubbleArrow = document.querySelector('#y-arrow');
      bubbleArrow.style.borderBottom = 0;
      bubbleArrow.style.borderTop = '10px solid rgba(13, 13, 13, .8)';
      bubbleArrow.style.top = `${bubble.offsetHeight}px`;
      bubbleArrow.style.left = `${arrowRelativeLeft}px`;
    }

    bubble.style.left = `${bubbleLeft}px`;
    bubble.style.top = `${bubbleTop}px`;


    document.addEventListener('click', ev => {
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
    });
    bubble.addEventListener('click', ev => {
      ev.stopPropagation();
    });

    Bubble.audioPlay();
    Bubble.addToWordBook();
  }

  static doTranslate(ev, options) {
    let [from, resType, query, youdaoKey] = [Bubble.keyfrom, 'json', window.getSelection().toString().trim(), Bubble.key];
    if (Object.is(query.toString().trim(), '')) return;

    Bubble.renderBubble(require('../tpl/bubble.jade')({
      loading: true
    }));
    let youdao = new Youdao(from, youdaoKey, resType, query);
    youdao.getContent()
      .then(data => {
        data.loading = false;
        if (options && options.wordbook) data.wordbook = options.wordbook;
        Bubble.renderBubble(require('../tpl/bubble.jade')(data));
      }).catch(err => {
        Bubble.renderBubble(require('../tpl/bubble.jade')({
          word: query,
          explains: err
        }));
      });
  }

  static enableDblclick(options) {
    document.addEventListener('dblclick', (ev) => Bubble.doTranslate(ev, options));
  }

  static enableKeydown(options) {
    let map = [];
    document.addEventListener('keydown', ev => map.push(ev.keyCode));
    document.addEventListener('keyup', ev => {
      if (!options.shortcut1 && !options.shortcut2) {
        return;
      } else if (!options.shortcut1 || !options.shortcut2) {
        if (Object.is(map.length, 1) && (Object.is(map[0], options.shortcut1) || Object.is(map[0], options.shortcut2))) {
          Bubble.doTranslate(ev, options);
        }
      } else {
        if (Object.is(map.length, 2) && Object.is(map[0], options.shortcut1) && Object.is(map[1], options.shortcut2)) {
          Bubble.doTranslate(ev, options);
        }
      }
      map = [];
    });
  }

  static enableSelectToTranslate(options) {
    document.addEventListener('mouseup', ev => {
      setTimeout(() => {
        let bubble = document.querySelector('#y-bubble');
        if (!bubble) Bubble.doTranslate(ev, options);
      });
    });
  }

  static audioPlay() {
    let audioAction = document.querySelector('#y-bubble-wav');
    if (audioAction) {
      audioAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        let audioNode = document.querySelector('#y-audio');
        audioNode.play();
      });
    }
  }

  static addToWordBook() {
    const addToWordBookSuccessText = '添加成功';
    const added = 'added';
    let addToWordBookAction = document.querySelector('#addToWordBookAction');
    if (addToWordBookAction) {
      addToWordBookAction.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (Object.is(ev.target.getAttribute('data-add-status'), added)) return;

        let word = ev.target.getAttribute('data-word');
        let spinner = document.querySelector('#ySpinner');
        spinner.className = spinner.className.replace(' hide', '');
        Youdao.addToWordBook(word).then(res => {
          if (res.added) {
            ev.target.setAttribute('data-add-status', added);
            ev.target.textContent = addToWordBookSuccessText;
          }
          spinner.className += ' hide';
        }).catch(err => {});
      });
    }
  }

  static popupQueryInput() {

  }

  static init() {
    chrome.storage.sync.get(items => {
      if (items.dblclick) Bubble.enableDblclick(items);
      if (items.shortcut) Bubble.enableKeydown(items);
      if (items.selectToTranslate) Bubble.enableSelectToTranslate(items);
      if (items.usePersonalKey) {
        Bubble.keyfrom = items.keyfrom || Bubble.keyfrom;
        Bubble.key = items.key || Bubble.key;
      }
    });
    Bubble.popupQueryInput();
  }
}

export default Bubble;
Bubble.init();
