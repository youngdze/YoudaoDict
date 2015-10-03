"use strict";

let _= require('underscore');

class Youdao {
    constructor(from, key, resType, query) {
        this.from = from;
        this.key = key;
        this.resType = resType;
        this.query = query;
        this.requestUrl = `https://fanyi.youdao.com/openapi.do?keyfrom=${this.from}&key=${this.key}&type=data&doctype=${this.resType}&version=1.1&q=`;
    }

    static isChinese(query) {
        const re = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return re.test(query);
    }

    parseJsonContent(res) {
        let word, explains, pronoun, wav, relate = [], more;

        word = res.query;
        if (!res) {
            explains = 'Nothing found.';
        } else if (_.isString(res)) {
            explains = res.toString();
        } else if (!res.basic) {
            explains = res.translation[0];
        } else {
            explains = res.basic.explains;
            if (res.basic.phonetic) {
                pronoun = (res.basic.phonetic.split(';'))[0];
            }
            if (!this.isChinese(word)) {
                wav = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`;
            }
            if (res.web) {
                relate = res.web;
            }
        }
        more = `http://dict.youdao.com/search?q=${res.query}`;

        return {
            word: word,
            wav: wav,
            explains: explains,
            pronoun: pronoun,
            relate: relate,
            more: more
        };
    }

    parseXmlContent(res) {
        let word, explains, pronoun, wav, relate = [], more;

        word = res.querySelector('query').textContent;
        if (!res) {
            explains = 'Nothing found.';
        } else if (_.isString(res)) {
            explains = res.toString();
        } else if (!_.size(res.querySelectorAll('basic'))) {
            explains = res.querySelector('translation').querySelector('paragraph').textContent;
        } else {
            let explainsNode = res.querySelector('basic').querySelector('explains').querySelectorAll('ex');
            explains = [];
            for (let i = 0; i < _.size(explainsNode); i++) {
                explains.push(explainsNode[i].textContent);
            }
            pronoun = res.querySelector('basic').querySelector('phonetic').textContent || undefined;

            if (!Youdao.isChinese(word)) {
                wav = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`;
            }

            let relates = res.querySelector('web').querySelector('explain');
            if (_.size(relates)) {
                for (let i = 0; i < _.size(relates); i++) {
                    let dummy = {};
                    dummy.key = relates[i].querySelector('key').textContent;
                    dummy.relate = [];

                    for (let j = 0; j < _.size(relates[i].querySelector('value').querySelectorAll('ex')); j++) {
                        dummy.relate.push(relates[i].querySelector('value').querySelectorAll('ex')[j].textContent);
                    }
                    relate.push(dummy);
                }
            }
        }
        more = res.querySelector('query')[0].textContent;

        return {
            word: word,
            wav: wav,
            pronoun: pronoun,
            explains: explains,
            relate: relate,
            more: more
        };
    }

    getContent() {
        let _this = this;
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', _this.requestUrl + encodeURIComponent(_this.query));
            req.responseType = Object.is(_this.resType.toLowerCase(), 'xml') ? 'document' : 'json';
            req.onload = () => {
                if (Object.is(req.readyState, 4)) {
                    if (Object.is(req.status, 200)) {
                        let res = req.response;
                        let result = Object.is(_this.resType.toLowerCase(), 'xml') ? _this.parseXmlContent(res) : _this.parseJsonContent(res);
                        resolve(result);
                    } else {
                        reject('Search failed');
                    }
                }
            };
            req.onerror = () => reject('Search failed');
            req.send();
        });
    }
}

module.exports = Youdao;