var Youdao = function (from, key, doctype, query) {
    if (isNaN(key) || from === null || doctype === null || query === null) {
        console.error('key should be number');
        return;
    }

    if (window.location.protocol.indexOf('https') < 0) {
        var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=' + from + '&key=' + key + '&type=data&doctype=' + doctype + '&version=1.1&q=';
    } else {
        var url = 'https://fanyi.youdao.com/openapi.do?keyfrom=' + from + '&key=' + key + '&type=data&doctype=' + doctype + '&version=1.1&q=';
    }
    //var url = 'data/youdao.json';

    this.getContent = function (callback, errCallback) {
        var req = new XMLHttpRequest();
        req.open('GET', url + encodeURIComponent(query));
        //req.open('GET', url);
        req.responseType = (doctype.toLowerCase() === 'xml') ? 'document' : 'json';
        req.onload = function () {
            var res = req.response;
            var result = (doctype.toLowerCase() === 'xml') ? parseXmlContent(res) : parseJsonContent(res);
            callback(result);
        };
        req.onerror = function () {
            errCallback('Search failed.');
        };
        req.send();
    }

   function parseJsonContent (res) {
        var word, explains, pronoun, wav, relate = [], more;

        word = res.query;
        if (res === null || res === '') {
            explains = 'Nothing found.';
        } else if (typeof res === 'string') {
            explains = res.toString();
        } else if (res.basic === undefined || res.basic === '') {
            explains = res.translation[0];
        } else {
            explains = res.basic.explains;

            if (res.basic.phonetic != undefined) {
                pronoun = (res.basic.phonetic.split(';'))[0];
            }

            wav = 'http://dict.youdao.com/dictvoice?audio=' + word + '&type=2';

            if (res.web != undefined) {
                relate = res.web;
            }
        }

        more = 'http://dict.youdao.com/search?q=' + res.query;

        var result = {
            word: word,
            wav: wav,
            explains: explains,
            pronoun: pronoun,
            relate: relate,
            more: more
        };
        return result;
    }

    function parseXmlContent(res) {
        var word, explains, pronoun, wav, relate = [], more;

        word = res.getElementsByTagName('query')[0].textContent;
        if (res === null || res === '') {
            explains = 'Nothing found.';
        } else if (typeof res === 'string') {
            explains = res.toString();
        } else if (res.getElementsByTagName('baisc').length === 0) {
            explains = res.getElementsByTagName('translation')[0].getElementsByTagName('paragraph')[0].textContent;
        } else {
            var explainsNode = res.getElementsByTagName('basic')[0].getElementsByTagName('explains')[0].getElementsByTagName('ex');
            explains = [];
            for (var i = 0; i < explainsNode.length; i++) {
                explains.push(explainsNode[i].textContent);
            }

            pronoun = res.getElementsByTagName('basic')[0].getElementsByTagName('phonetic')[0].textContent || undefined;
            wav = 'http://dict.youdao.com/dictvoice?audio=' + word + '&type=2';

            var relates = res.getElementsByTagName('web')[0].getElementsByTagName('explain');
            if (relates.length > 0) {
                for (var i = 0; i < relates.length; i++) {
                    var dummy = {};
                    dummy.key = relates[i].getElementsByTagName('key').textContent;
                    dummy.relate = [];

                    for (var j = 0; j < relates[i].getElementsByTagName('value')[0].getElementsByTagName('ex').length; j++) {
                        dummy.relate.push(relates[i].getElementsByTagName('value')[0].getElementsByTagName('ex')[j].textContent);
                    }

                    relate.push(dummy);
                }
            }
        }

        more = res.getElementsByTagName('query')[0].textContent;

        var result = {
            word: word,
            wav: wav,
            pronoun: pronoun,
            explains: explains,
            relate: relate,
            more: more
        };
        return result;
    } 
};