function save_options() {
    var dblclick = document.querySelector('#dblclick').checked;
    var ctrl = document.querySelector('#ctrl').checked;
    chrome.storage.sync.set({
        dblclick: dblclick,
        ctrl: ctrl
    }, function() {
        Materialize.toast('Saved', 500);
    });
}

function restore_options() {
    chrome.storage.sync.get(function (items) {
        document.querySelector('#dblclick').checked = items.dblclick;
        document.querySelector('#ctrl').checked = items.ctrl;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);

var options = document.querySelectorAll('input[type=checkbox]');
Object.keys(options).map(function (key) {
    // detect if is number
    if (!isNaN(key - 0)) {
        options[key].addEventListener('click', save_options);
    }
});
