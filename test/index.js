'use strict';

import mocha from 'mocha';
import {expect} from 'chai';
import Youdao from '../src/script/util/youdao';

describe('Youdao util test', () => {
  let [from, resType, query, youdaoKey] = ['YoungdzeBlog', 'json', 'test', 498418215];
  let youdao = new Youdao(from, youdaoKey, resType, query);
  let requestUrl = `https://fanyi.youdao.com/openapi.do?keyfrom=${from}&key=${youdaoKey}&type=data&doctype=${resType}&version=1.1&q=${query}`;

  it('should recognize Chinese', () => {
    expect(youdao.isChinese()).to.be.false;
    expect(youdao.isChinese('')).to.be.false;
    expect(youdao.isChinese('/')).to.be.false;
    expect(youdao.isChinese('/sdkl;')).to.be.false;
    expect(youdao.isChinese('mocha')).to.be.false;
    expect(youdao.isChinese('mocha mocha')).to.be.false;
    expect(youdao.isChinese('摩0卡')).to.be.false;
    expect(youdao.isChinese('摩,卡')).to.be.false;
    expect(youdao.isChinese('摩卡 摩卡')).to.be.false;
    expect(youdao.isChinese('摩卡')).to.be.true;
    expect(youdao.isChinese('摩卡摩卡摩卡')).to.be.true;
  });

  it('should fetch translation data', () => {
  });
});
