var express = require('express');

var app = express();

app.use('/views', express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

module.exports = app;

app.listen(8000);