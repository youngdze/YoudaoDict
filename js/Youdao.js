"use strict";

let _ = require('underscore');

class Youdao {
    constructor(from, key, resType, query) {
        [this.from, this.key, this.resType, this.query] = [from, key, resType, query];
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
            res.basic.phonetic && (pronoun = res.basic.phonetic.split(';')[0]);
            !Youdao.isChinese(word) && (wav = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`);
            res.web && (relate = res.web);
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
            explains = _.map(explainsNode, ( v, k ) => { return v.textContent; });
            pronoun = res.querySelector('basic').querySelector('phonetic').textContent || undefined;
            !Youdao.isChinese(word) && (wav = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`);

            let relates = res.querySelector('web').querySelector('explain');
            if (_.size(relates)) {
                relate = _.map(relates, (v, k) => {
                    let dummy = {};
                    dummy.key = v.querySelector('key').textContent;
                    dummy.relate = _.map(v.querySelector('value').querySelectorAll('ex'), (val, key) => { return val.textContent; });
                    return dummy;
                });
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
            if (!self.fetch) self.fetch = require('./fetch.js');
            fetch(this.requestUrl + encodeURIComponent(this.query))
                .then(res => {
                    if (res.ok) {
                        // TODO judge res type
                        res.json().then(data => {
                            let result = _this.parseJsonContent(data);
                            resolve(result);
                        });
                    } else {
                        reject('Search failed');
                    }
                }, err => {
                    reject('Search failed');
                });
        });
    }
}

module.exports = Youdao;