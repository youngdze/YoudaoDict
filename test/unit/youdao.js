import 'mocha';
import {expect} from 'chai';
import fetch from 'node-fetch';
import Youdao from '../../src/script/util/youdao';

describe(`Youdao`, () => {
  const [FROM, DOCTYPE, QUERY, KEY] = [`YoungdzeBlog`, `json`, `require`, 498418215];
  const REQ_URL = `https://fanyi.youdao.com/openapi.do?keyfrom=${FROM}&key=${KEY}&type=data&doctype=${DOCTYPE}&version=1.1&q=${QUERY}`;
  const URL_REG = /^(ftp|https?:\/\/)?(((www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)|localhost|(([1-9]\d{2}\.){3}[1-9]\d{2}))([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;

  let youdao = new Youdao(FROM, KEY, DOCTYPE, QUERY);

  describe(`#isChinese`, () => {
    it(`should be Chinese`, () => {
      expect(youdao.isChinese(`摩卡`)).to.equal(true);
      expect(youdao.isChinese(`摩卡摩卡摩卡摩卡摩卡摩卡摩卡摩卡摩卡摩卡`)).to.equal(true);
    });

    it(`should not be Chinese`, () => {
      expect(youdao.isChinese()).to.equal(false);
      expect(youdao.isChinese(`mocha`)).to.equal(false);
      expect(youdao.isChinese(` mocha`)).to.equal(false);
      expect(youdao.isChinese(` mocha `)).to.equal(false);
      expect(youdao.isChinese(`摩卡m`)).to.equal(false);
      expect(youdao.isChinese(`m摩卡`)).to.equal(false);
      expect(youdao.isChinese(`摩卡 `)).to.equal(false);
      expect(youdao.isChinese(` 摩卡`)).to.equal(false);
    });
  });

  describe(`#parseJsonContent`, () => {
    let parsedJson = {};

    it('fetch json', (done) => {
      fetch(REQ_URL).then(res => res.json().then(json => {
        parsedJson = youdao.parseJsonContent(json);
        done();
      }));
    });

    it(`should has necessary own property`, () => {
      expect(parsedJson).to.have.ownProperty(`word`);
      expect(parsedJson).to.have.ownProperty(`explains`);
      expect(parsedJson).to.have.ownProperty(`pronoun`);
      expect(parsedJson).to.have.ownProperty(`relate`);
      expect(parsedJson).to.have.ownProperty(`more`);
    });

    it(`property "word" is valid`, () => {
      let word = parsedJson.word;
      expect(word).to.be.a('string');
    });

    it('property "wav" is valid', () => {
      let wav = parsedJson.wav;
      expect(wav).to.match(URL_REG);
    });

    it('property "explains" valid', () => {
      let explains = parsedJson.explains;
      expect(explains).to.be.an('array');
    });

    it('property "pronoun" is valid', () => {
      let pronoun = parsedJson.pronoun;
      expect(pronoun).to.be.a('string');
    });

    it('property "relate" is valid', () => {
      let relates = parsedJson.relate;
      expect(relates).to.be.an('array');
      relates.forEach(it => {
        expect(it).to.has.ownProperty('value').and.has.ownProperty('key');
        expect(it.value).to.be.an('array');
        expect(it.key).to.be.a('string');
      });
    });

    it('property "more" is valid', () => {
      let more = parsedJson.more;
      expect(more).to.match(URL_REG);
    });
  });
});
