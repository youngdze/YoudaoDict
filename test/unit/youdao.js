import {readFileSync} from 'fs';
import {join as pathJoin} from 'path';
import 'mocha';
import {expect} from 'chai';
import Youdao from '../../src/script/util/youdao.js';

describe(`Youdao`, () => {
  const [from, resType, query, youdaoKey] = [`YoungdzeBlog`, `json`, `test`, 498418215];
  let youdao = new Youdao(from, youdaoKey, resType, query);

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
    let dataJson = JSON.parse(readFileSync(pathJoin(__dirname, `./data.json`), `utf-8`));
    let parsedJson = youdao.parseJsonContent(dataJson);
    const urlReg = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;

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
      expect(wav).to.match(urlReg);
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
      expect(more).to.match(urlReg);
    });
  });
});
