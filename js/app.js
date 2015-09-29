var Bubble = require('./bubble.js');

chrome.storage.sync.get(function( items ){
  if(items.dblclick) Module.enableDblclick();
  if(items.ctrl) Module.enableKeydown();
});

function y_playSound( wav_file ){
  document.querySelector('#y-bubble-wav-wrapper').innerHTML = '<embed src="' + wav_file + '" type="audio/wav" autostart="true" style="width: 0; height: 0;">';
}