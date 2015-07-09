function getTemplate(callback) {
    var req = new XMLHttpRequest();
    var url = chrome.extension.getURL('template/bubble.html');
    req.open('GET', url);
    req.onload = function () {
        var res = req.response;
        callback(res);
    };
    req.send();
}

function injectData(template, result) {
    Mustache.parse(template);
    var rendered = Mustache.render(template, result);
    return rendered;
};

function renderBubble(rendered) {
    if (document.getElementById('y-bubble') != null) {
        var unnecessaryBubble = document.getElementById('y-bubble');
        unnecessaryBubble.parentNode.removeChild(unnecessaryBubble);
    }

    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var rect = range.getBoundingClientRect();
    var bubbleLeft, bubbleTop, arrowRelativeLeft;

    var dummy = document.createElement('DIV');
    dummy.innerHTML = rendered.trim();
    var dummyChild = dummy.childNodes;
    document.body.appendChild(dummyChild[0]);

    var bubble = document.getElementById('y-bubble');

    bubbleLeft = rect.left + rect.width / 2 - bubble.offsetWidth / 2;

    if (bubbleLeft < 5) {
        bubbleLeft = 5;
        arrowRelativeLeft = rect.left + rect.width / 2 - 15;
    } else if ((bubbleLeft + bubble.offsetWidth) > (document.body.offsetWidth + 5)) {
        bubbleLeft = document.body.offsetWidth - bubble.offsetWidth - 5;
        arrowRelativeLeft = rect.left - bubbleLeft - 10 + rect.width / 2;
    } else {
        arrowRelativeLeft = bubble.offsetWidth / 2 - 10;
    }

    if (rect.top < bubble.offsetHeight) {
        bubbleTop = rect.top + window.scrollY + rect.height + 8;

        var bubbleArrow = document.getElementById('y-arrow');
        bubbleArrow.style.borderBottom = '10px solid rgba(13, 13, 13, .8)';
        bubbleArrow.style.borderTop = 0;
        bubbleArrow.style.top = '-8px';
        bubbleArrow.style.left = arrowRelativeLeft + 'px';
    } else {
        bubbleTop = rect.top + window.scrollY - bubble.offsetHeight - 10;

        var bubbleArrow = document.getElementById('y-arrow');
        bubbleArrow.style.borderBottom = 0;
        bubbleArrow.style.borderTop = '10px solid rgba(13, 13, 13, .8)';
        bubbleArrow.style.top = bubble.offsetHeight + 'px';
        bubbleArrow.style.left = arrowRelativeLeft + 'px';
    }

    bubble.style.left = bubbleLeft + 'px';
    bubble.style.top = bubbleTop + 'px';


    document.addEventListener('click', function (ev) {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    });
    bubble.addEventListener('click', function (ev) {
        ev.stopPropagation();
    });
}

function enableDblclick () {
    document.addEventListener('dblclick', function (ev) {
        var from = 'YoungdzeBlog';
        var doctype = 'json';
        var query = window.getSelection().toString().trim();
        var youdaoKey = 498418215;

        if (query === '') return;

        var rendered;

        getTemplate.call(this, function (template) {
            rendered = injectData(template, {loading: true});
            renderBubble(rendered);

            var youdao  = new Youdao(from, youdaoKey, doctype, query);
            youdao.getContent.call(this, function (result) {
                result.loading = false;
                rendered = injectData(template, result);
                renderBubble(rendered);
            }, function (err) {
                rendered = injectData(template, {explains: err});
                renderBubble(rendered);
            });
        });
    });
}

function enableKeydown() {
    var map = [];
    document.addEventListener('keydown', function (ev) {
        map.push(ev.keyCode);
    });
    document.addEventListener('keyup', function (ev) {
        if (map.length === 1 && map[0] === 17) {
            var from = 'YoungdzeBlog';
            var doctype = 'json';
            var query = window.getSelection().toString().trim();
            var youdaoKey = 498418215;

            if (query === '') return;

            var rendered;

            getTemplate.call(this, function (template) {
                rendered = injectData(template, {loading: true});
                renderBubble(rendered);

                var youdao  = new Youdao(from, youdaoKey, doctype, query);
                youdao.getContent.call(this, function (result) {
                    result.loading = false;
                    rendered = injectData(template, result);
                    renderBubble(rendered);
                }, function (err) {
                    rendered = injectData(template, {explains: err});
                    renderBubble(rendered);
                });
            });
        }
        map = [];
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

function y_playSound(wav_file) {
    document.getElementById('y-bubble-wav-wrapper').innerHTML = '<embed src="' + wav_file + '" type="audio/wav" autostart="true" style="width: 0; height: 0;">';
}
