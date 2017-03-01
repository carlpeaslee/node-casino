'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _StandardDeck = require('./config/StandardDeck');

var _StandardDeck2 = _interopRequireDefault(_StandardDeck);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set('port', 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Server is running at port ' + app.get('port'));
});

var io = new _socket2.default(server);

io.on('connection', function (socket) {
  console.log('connection received');
  socket.on('newGame', function (data) {
    console.log('newGame request', data);
  });
});