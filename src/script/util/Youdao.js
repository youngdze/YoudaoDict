"use strict";

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
    let word, explains, pronoun, wav, relate = [],
      more;

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
    let word, explains, pronoun, wav, relate = [],
      more;

    word = res.querySelector('query').textContent;
    if (!res) {
      explains = 'Nothing found.';
    } else if (Object.is(typeof res, 'string')) {
      explains = res.toString();
    } else if (!res.querySelectorAll('basic').length) {
      explains = res.querySelector('translation').querySelector('paragraph').textContent;
    } else {
      let explainsNode = res.querySelector('basic').querySelector('explains').querySelectorAll('ex');
      explains = explainsNode.map(v => v.textContent);
      pronoun = res.querySelector('basic').querySelector('phonetic').textContent || undefined;
      !Youdao.isChinese(word) && (wav = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`);

      let relates = res.querySelector('web').querySelector('explain');
      if (relates.length) {
        relate = relates.map(v => {
          let dummy = {};
          dummy.key = v.querySelector('key').textContent;
          dummy.relate = [...v.querySelector('value')].map(v => val.textContent);
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
      require('./fetch')(this.requestUrl + encodeURIComponent(this.query))
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

  static addToWordBook(word) {
    const wordBookLoginUrl = 'http://account.youdao.com/login?service=dict&back_url=http://dict.youdao.com/wordbook/wordlist%3Fkeyfrom%3Dnull';
    const addToWordBookApi = 'http://dict.youdao.com/wordbook/ajax?action=addword&q=';
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
              reject();
            } else if(Object.is(data.message, addOne)) {
              resolve();
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
