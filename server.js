'use strict';

let express = require('express');
let app = express();

const port = process.env.PORT || 8080;

app.get('/', function( req, res ){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

app.listen(port, function(){
  console.log('server starts at localhost:%s', port);
});
