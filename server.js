'use strict';

let express = require('express');
let app = express();
let logger = require('');
let path = require('path');

const port = process.env.PORT || 8080;

app.get('/', function( req, res ){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname)));

app.listen(port, function(){
  console.log('server starts at localhost:%s', port);
});
