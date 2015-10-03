"use strict";

define(['underscore'], function( _ ){
  class Module {
    constructor(){
    }

    static translate( query ){
      return new Promise(function( resolve, reject ){
        let url = 'https://fanyi.youdao.com/openapi.do?keyfrom=YoungdzeBlog&key=498418215&type=data&doctype=json&version=1.1&q=';
        let req = new XMLHttpRequest();
        req.open('GET', url + encodeURIComponent(query));
        req.responseType = 'json';
        req.onload = function(){
          if(Object.is(req.readyState, 4)){
            if(Object.is(req.status, 200)){
              resolve(req.response);
            } else{
              reject('Network error: ' + req.status);
            }
          }
        };
        req.onerror = function(){
          reject('Network error.');
        };
        req.send();
      });
    }

    static isLoad( isLoading ){
      document.querySelector('#loading').hidden = !isLoading;
      document.querySelector('#resultBox').hidden = isLoading;
    }

    static renderResult( resultJson ){
      Module.isLoad(false);
      let basic = document.querySelector('#basic');
      while(!_.isNull(basic.nextElementSibling)) basic.nextElementSibling.remove();

      if(!resultJson){
        basic.textContent = 'Nothing found.';
        return;
      }
      if(_.isString(resultJson)){
        basic.textContent = resultJson.toString();
        return;
      }
      if(!resultJson.basic){
        basic.textContent = resultJson.translation[0];
        return;
      }
      if(!_.isUndefined(resultJson.basic.phonetic)){
        basic.innerHTML = '<code class="pronoun">/' + (resultJson.basic.phonetic.split(';'))[0] + '/</code>';
      } else{
        basic.innerHTML = '';
      }

      for(let i = 0; i < resultJson.basic.explains.length; i++){
        if(i){
          basic.innerHTML += '<br>' + resultJson.basic.explains[i];
        } else{
          basic.innerHTML += resultJson.basic.explains[i];
        }
      }

      let webTranslation = resultJson.web;
      for(let i = 0; i < _.size(webTranslation); i++){
        var pEle = document.createElement('P');
        pEle.className = 'web-translation';
        pEle.textContent = webTranslation[i].key + ':  ' + webTranslation[i].value.join(', ');
        document.querySelector('#resultField').appendChild(pEle);
      }
    }

    static processResult( queryInput ){
      let query = queryInput.value;
      if(!query) return;

      Module.isLoad(true);
      Module.translate(query).then(function( res ){
        Module.renderResult(res);
      }).catch(function( err ){
        Module.renderResult(err);
      });
    }

    static onLoad(){
      let form = document.forms.namedItem('dictForm');
      let queryInput = form.query;
      let timeout;
      queryInput.focus();

      form.addEventListener('submit', function( ev ){
        ev.preventDefault();
        Module.processResult(queryInput);
      });

      queryInput.addEventListener('keyup', function( ev ){
        if(Object.is(ev.keyCode, 13)) return;
        if(timeout){
          clearTimeout(timeout);
          timeout = null;
        }

        timeout = setTimeout(function(){
          Module.processResult(queryInput);
        }, 700);
      });
    }
  }

  return Module;
});
