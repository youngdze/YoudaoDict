"use strict";

// TODO React support
require('../css/bubble.less');
let _ = require('underscore');
let Youdao = require('./Youdao.js');

class Module {
    constructor() {
    }

    static renderBubble(rendered) {
        if (document.querySelector('#y-bubble')) {
            let unnecessaryBubble = document.querySelector('#y-bubble');
            unnecessaryBubble.parentNode.removeChild(unnecessaryBubble);
        }

        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();
        let bubbleLeft, bubbleTop, arrowRelativeLeft;

        let dummy = document.createElement('DIV');
        dummy.innerHTML = rendered.trim();
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
            bubbleTop = rect.top + window.scrollY + rect.height + 8;

            let bubbleArrow = document.querySelector('#y-arrow');
            bubbleArrow.style.borderBottom = '10px solid rgba(13, 13, 13, .8)';
            bubbleArrow.style.borderTop = 0;
            bubbleArrow.style.top = '-8px';
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
    }

    static enableDblclick() {
        document.addEventListener('dblclick', ev => {
            let [from, resType, query, youdaoKey] = ['YoungdzeBlog', 'json', window.getSelection().toString().trim(), 498418215];
            if (_.isEmpty(query)) return;

            Module.renderBubble(require('../template/bubble.jade')({explains: 'Searching...'}));
            let youdao = new Youdao(from, youdaoKey, resType, query);
            youdao.getContent()
                .then(data => {
                    data.loading = false;
                    Module.renderBubble(require('../template/bubble.jade')(data));
                }).catch(err => {
                    Module.renderBubble(require('../template/bubble.jade')({explains: err}));
                });
        });
    }

    static enableKeydown() {
        let map = [];
        document.addEventListener('keydown', ev => map.push(ev.keyCode));
        document.addEventListener('keyup', ev => {
            if (Object.is(_.size(map), 1) && Object.is(map[0], 17)) {
                let [from, resType, query, youdaoKey] = ['YoungdzeBlog', 'json', window.getSelection().toString().trim(), 498418215];
                if (_.isEmpty(query)) return;

                Module.renderBubble(require('../template/bubble.jade')({explains: 'Searching...'}));
                let youdao = new Youdao(from, youdaoKey, resType, query);
                youdao.getContent()
                    .then(data => {
                        data.loading = false;
                        Module.renderBubble(require('../template/bubble.jade')(data));
                    }).catch(err => {
                        Module.renderBubble(require('../template/bubble.jade')({explains: err}));
                    });
            }
            map = [];
        });
    }
}

module.exports = Module;
