"use strict";

define(['underscore'], function (_) {
    let modules = {};

    modules.translate = function (query) {
        return new Promise(function (resolve, reject) {
            let url = 'https://fanyi.youdao.com/openapi.do?keyfrom=YoungdzeBlog&key=498418215&type=data&doctype=json&version=1.1&q=';
            let req = new XMLHttpRequest();
            req.open('GET', url + encodeURIComponent(query));
            req.responseType = 'json';
            req.onload = function () {
                if (Object.is(req.readyState, 4)) {
                    if (Object.is(req.status, 200)) {
                        resolve(req.response);
                    } else {
                        reject('Network error: ' + req.status);
                    }
                }
            };
            req.onerror = function () {
                reject('Network error.');
            };
            req.send();
        });
    };

    modules.isLoad = function (isLoading) {
        document.getElementById('loading').hidden = !isLoading;
        document.getElementById('resultBox').hidden = isLoading;
    };

    modules.renderResult = function (resultJson) {
        modules.isLoad(false);
        let basic = document.getElementById('basic');
        while (!_.isNull(basic.nextElementSibling)) basic.nextElementSibling.remove();

        if (!resultJson) {
            basic.textContent = 'Nothing found.';
            return;
        }
        if (_.isString(resultJson)) {
            basic.textContent = resultJson.toString();
            return;
        }
        if (!resultJson.basic) {
            basic.textContent = resultJson.translation[0];
            return;
        }
        if (!_.isUndefined(resultJson.basic.phonetic)) {
            basic.innerHTML = '<code class="pronoun">/' + (resultJson.basic.phonetic.split(';'))[0] + '/</code>';
        } else {
            basic.innerHTML = '';
        }

        for (let i = 0; i < resultJson.basic.explains.length; i++) {
            if (i) {
                basic.innerHTML += '<br>' + resultJson.basic.explains[i];
            } else {
                basic.innerHTML += resultJson.basic.explains[i];
            }
        }

        let webTranslation = resultJson.web;
        for (let i = 0; i < _.size(webTranslation); i++) {
            var pEle = document.createElement('P');
            pEle.className = 'web-translation';
            pEle.textContent = webTranslation[i].key + ':  ' + webTranslation[i].value.join(', ');
            document.getElementById('resultField').appendChild(pEle);
        }
    };

    modules.processResult = function (queryInput) {
        let query = queryInput.value;
        if (!query) return;

        modules.isLoad(true);
        modules.translate(query).then(function (res) {
            modules.renderResult(res);
        }).catch(function (err) {
            modules.renderResult(err);
        });
    };

    modules.onLoad = function () {
        let form = document.forms.namedItem('dictForm');
        let queryInput = form.query;
        let timeout;
        queryInput.focus();

        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            modules.processResult(queryInput);
        });

        queryInput.addEventListener('keyup', function (ev) {
            if (Object.is(ev.keyCode, 13)) return;
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            timeout = setTimeout(function () {
                modules.processResult(queryInput);
            }, 700);
        });
    };

    return modules;
});
