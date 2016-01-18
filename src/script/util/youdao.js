"use strict";

class Youdao {
  constructor(from, key, resType, query) {
    [this.from, this.key, this.resType, this.query] = [from, key, resType, query];
    this.requestUrl = `https://fanyi.youdao.com/openapi.do?keyfrom=${this.from}&key=${this.key}&type=data&doctype=${this.resType}&version=1.1&q=`;
  }

  isChinese(str) {
    const re = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/gi;
    return re.test(str);
  }

  parseJsonContent(res) {
    let word, explains, pronoun, wav, relate = [], more;
    res = (typeof res === 'string') ? JSON.parse(res) : res;

    word = res.query;
    if (!res) {
      explains = 'Nothing found.';
    } else if (Object.is(typeof res, 'string')) {
      explains = res.toString();
    } else if (!res.basic) {
      explains = res.translation[0];
    } else {
      explains = res.basic.explains;
      res.basic.phonetic && (pronoun = res.basic.phonetic.split(';')[0]);
      !this.isChinese(word) && (wav = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`);
      res.web && (relate = res.web);
    }
    more = `http://dict.youdao.com/search?q=${res.query}`;

    return {word, wav, explains, pronoun, relate, more};
  }

  parseXmlContent(res) {
    let word, explains, pronoun, wav, relate = [], more;
    res = (new DOMParser()).parseFromString(res, 'text/xml');

    word = res.querySelector('query').textContent.toString().trim();
    if (!res) {
      explains = 'Nothing found.';
    } else if (Object.is(typeof res, 'string')) {
      explains = res.toString().trim();
    } else if (!res.querySelectorAll('basic').length) {
      explains = res.querySelector('translation').querySelector('paragraph').textContent.toString().trim();
    } else {
      let explainsNode = res.querySelector('basic').querySelector('explains').querySelectorAll('ex');
      explains = [...explainsNode].map(v => v.textContent.toString().trim());
      pronoun = res.querySelector('basic').querySelector('phonetic').textContent.toString().trim() || undefined;
      !this.isChinese(word) && (wav = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`);

      let relates = [...res.querySelector('web').querySelector('explain')];
      if (relates.length) {
        relate = relates.map(v => {
          let dummy = {};
          dummy.key = v.querySelector('key').textContent.toString().trim();
          dummy.relate = [...v.querySelector('value')].map(v => val.textContent.toString().trim());
          return dummy;
        });
      }
    }
    more = res.querySelector('query')[0].textContent.toString().trim();

    return {word, wav, explains, pronoun, relate, more};
  }

  getContent() {
    let _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${this.requestUrl}${encodeURIComponent(this.query)}`)
        .then(res => {
          if (res.ok) {
            // TODO judge res type
            res.text().then(data => {
              let result;
              if(Object.is(_this.resType, 'json')) {
                result = _this.parseJsonContent(data);
              } else {
                result = _this.parseXmlContent(data);
              }
              resolve(result);
            });
          } else {
            reject('Query failed');
          }
        }, err => {
          reject('Query failed');
        });
    });
  }

  static addToWordBook(word) {
    const wordBookLoginUrl = 'http://account.youdao.com/login?service=dict&back_url=http://dict.youdao.com/wordbook/wordlist%3Fkeyfrom%3Dnull';
    const addToWordBookApi = 'https://dict.youdao.com/wordbook/ajax?action=addword&q=';
    const wordBookDomain = 'dict.youdao.com';
    // I think the api is maked by an intern: adddone => addone
    const [noUser, addOne] = ['nouser', 'adddone'];

    let headers = new Headers();
    if(chrome && chrome.cookies) {
      chrome.cookies.getAll({}, (cookies) => {
        cookies.forEach(cookie => {
          if(Object.is(cookie.domain, wordBookDomain)) {
            headers.append('Cookie', `${cookie.name}=${cookie.value}`);
          }
        });
      });
    }

    return new Promise((resolve, reject) => {
      require('./fetch')(`${addToWordBookApi}${word}`, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
      }).then(res => {
        if(res.ok) {
          res.json().then(data => {
            if(Object.is(data.message, noUser)) {
              if(chrome && chrome.tabs) {
                chrome.tabs.create({url: wordBookLoginUrl});
              } else {
                window.open(wordBookLoginUrl, '_blank');
              }
              resolve({added: false});
            } else if(Object.is(data.message, addOne)) {
              resolve({added: true});
            }
          });
        } else {
          reject();
        }
      }, err => {
        reject(err);
      });
    });
  }
}

export default Youdao;
