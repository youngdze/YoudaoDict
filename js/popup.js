function translate(query, callback, errCallback) {
    var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=YoungdzeBlog&key=498418215&type=data&doctype=json&version=1.1&q=';
    var req = new XMLHttpRequest();
    req.open('GET', url + encodeURIComponent(query));
    req.responseType = 'json';
    req.onload = function () {
        var res = req.response;
        callback(res);
    };
    req.onerror = function () {
        errCallback('Network error.');
        return;
    };
    req.send();
}

function renderResult(resultJson) {
    isLoad(false);
    var basic = document.getElementById('basic');
    while (basic.nextElementSibling != null) {
        basic.nextElementSibling.remove();
    }

    if (resultJson === undefined || resultJson === null || resultJson === '') {
        basic.textContent = 'Nothing found.';
        return;
    }
    if (typeof resultJson === 'string') {
        basic.textContent = resultJson.toString();
        return;
    }
    if (resultJson.basic === '' || resultJson.basic === undefined) {
        basic.textContent = resultJson.translation[0];
        return;
    }

    if (resultJson.basic.phonetic != undefined) {
        basic.innerHTML = '<code class="pronoun">/' + (resultJson.basic.phonetic.split(';'))[0] + '/</code>';
    } else {
        basic.innerHTML = '';
    }

    for (var i = 0; i < resultJson.basic.explains.length; i++) {
        if (i === 0) {
            basic.innerHTML += resultJson.basic.explains[i];
        } else {
            basic.innerHTML += '<br>' + resultJson.basic.explains[i];
        }
    }

    var webTranslation = resultJson.web;
    for (var i = 0; i < webTranslation.length; i++) {
        var pEle = document.createElement('P');
        pEle.className = 'web-translation';
        pEle.textContent = webTranslation[i].key + ':  ' + webTranslation[i].value.join(', ');
        document.getElementById('resultField').appendChild(pEle);
    }
}

function isLoad(isLoading) {
    document.getElementById('loading').hidden = !isLoading;
    document.getElementById('resultBox').hidden = isLoading;
}

function processResult(queryInput) {
    var query = queryInput.value;
    if (query === undefined || query === null || query === '') return;

    isLoad(true);
    translate(query, function (res) {
        renderResult(res);
    }, function (errMessage) {
        renderResult(errMessage);
    });
}

document.addEventListener('DOMContentLoaded', function (ev) {
    var form = document.forms.namedItem('dictForm');
    var queryInput = form.query;
    var timeout;
    queryInput.focus();

    form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        processResult(queryInput);
    });

    queryInput.addEventListener('keyup', function (ev) {
        if (ev.keyCode === 13) return;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        timeout = setTimeout(function () {
            processResult(queryInput);
        }, 700);
    });
});

