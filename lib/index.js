'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _VideoPoker = require('games/VideoPoker');

var _VideoPoker2 = _interopRequireDefault(_VideoPoker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set('port', 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Server is running at port ' + app.get('port'));
});

var io = new _socket2.default(server);

io.of('/videopoker').on('connection', _VideoPoker2.default);