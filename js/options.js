function save_options() {
    var dblclick = document.querySelector('#dblclick').checked;
    var ctrl = document.querySelector('#ctrl').checked;
    chrome.storage.sync.set({
        dblclick: dblclick,
        ctrl: ctrl
    }, function() {
        var status = document.querySelector('#save');
        status.innerHTML= '<i class="mdi-action-done"></i>';
        setTimeout(function() {
            status.innerHTML = 'Save';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get(function (items) {
        document.querySelector('#dblclick').checked = items.dblclick;
        document.querySelector('#ctrl').checked = items.ctrl;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
