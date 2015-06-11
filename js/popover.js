function translate(query, callback, errCallback) {
    if (window.location.protocol.indexOf('https') < 0) {
        var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=YoungdzeBlog&key=498418215&type=data&doctype=json&version=1.1&q=';
    } else {
        var url = 'https://fanyi.youdao.com/openapi.do?keyfrom=YoungdzeBlog&key=498418215&type=data&doctype=json&version=1.1&q=';
    }
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

function getPosition(event) {
    console.assert(event instanceof Event, 'Not a valid instance of Event');
    event = event || window.event; // IE-ism
    var eventDoc, doc, body;

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0 );
    }
    return {
       "left": event.pageX,
        "top": event.pageY
    };
}

function getPositionByRange() {
    if (!window.getSelection()) return;

    var sel, range, rects, rect, x, y;
    sel = window.getSelection();
    if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        if (range.getClientRects) {
            range.collapse(true);
            rects = range.getClientRects();
            if (rects.length > 0) {
                rect = range.getClientRects()[0];
            }
            x = rect.left;
            y = rect.top;
        }
    }
    return {
        "left": x,
        "top": y
    }
}

function materialShow(num) {
    if (num > 100) return;
    console.log(num);
    setTimeout(function () {
        materialShow(num + 10);
    }, 500);
}

function initialPop(ev) {
    if (document.getElementById('cardWrapper')) {
        var cardWrapper = document.getElementById('cardWrapper');
        cardWrapper.parentNode.removeChild(cardWrapper);
    }

    //var pos = getPosition(ev);
    var pos = getPositionByRange();
    var html =
    '<div id="cardWrapper" class="card-wrapper" style="left: ' + (pos.left - 0) + 'px; top: ' + (pos.top + window.scrollY + 20) + 'px;">' +
        '<div class="card blue-grey darken-1">' +
            '<div class="card-content white-text">' +
                '<span class="card-title">Loading...</span>' +
            '</div>' +
        '</div>' +
    '</div>';
    var dummy = document.createElement('DIV');
    dummy.innerHTML = html;
    var cardNode = dummy.childNodes;
    document.body.appendChild(cardNode[0]);

    var cardWrapper = document.getElementById('cardWrapper');
    document.addEventListener('click', function (event) {
        if (cardWrapper.parentNode) {
            cardWrapper.parentNode.removeChild(cardWrapper);
        }
    });
    cardWrapper.addEventListener('click', function (event) {
        event.stopPropagation();
    });
}

function renderPop(resJson) {
    var cardWrapper = document.getElementById('cardWrapper');
    var cardTitle = cardWrapper.getElementsByClassName('card-title')[0];

    if (resJson === undefined || resJson === null || resJson === '') {
        cardTitle.textContent = 'Nothing found.';
        return;
    }
    if (typeof resJson === 'string') {
        cardTitle.textContent = resJson.toString();
        return;
    }
    if (resJson.basic === '' || resJson.basic === undefined) {
        cardTitle.textContent = resJson.translation[0];
        return;
    }

    cardTitle.textContent = resJson.basic.explains[0];
    var webTranslation = resJson.web;

    for (var i = 0; i < webTranslation.length; i++) {
        var pEle = document.createElement('P');
        pEle.className = 'web-translation';
        pEle.textContent = webTranslation[i].key + ': ' + webTranslation[i].value.join(', ');
        cardTitle.parentNode.appendChild(pEle);
    }
}

function enableDblclick() {
    document.addEventListener('dblclick', function (ev) {
        var text = window.getSelection().toString().trim();
        if (text === null || text === undefined || text.length === 0) return;

        initialPop(ev);
        translate(text, function (res) {
            renderPop(res);
        }, function (errMessage) {
            renderPop(errMessage);
        });
    });
}

function enableKeydown() {
    document.addEventListener('keydown', function (ev) {
        //console.log(String.fromCharCode(ev.keyCode));
        if (!ev.ctrlKey) return;
        var text = window.getSelection().toString().trim();
        if (text === null || text === undefined || text.length === 0) return;

        initialPop(ev);
        translate(text, function (res) {
            renderPop(res);
        }, function (errMessage) {
            renderPop(errMessage);
        });
    });
}

(function () {
    chrome.storage.sync.get(function (items) {
        if (items.dblclick) {
            enableDblclick();
        }
        if (items.ctrl) {
            enableKeydown();
        }
    });
})();