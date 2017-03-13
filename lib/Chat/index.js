'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Chat = function Chat(client) {

  client.join('global', function () {
    client.emit('notification', "You've joined the GameSmart chat room.");
  });

  client.on('join', function () {
    var roomData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { id: id, name: name };
    return function () {
      var room = roomData.id,
          name = roomData.name;

      client.join(room, function () {
        client.emit('notification', 'You\'ve joined the ' + name + ' chat room.');
        client.to(room).emit('notification', client.id + ' has joined the ' + name + ' chat room.');
      });
    }();
  });

  client.on('disconnecting', function () {
    var rooms = Object.keys(client.rooms);
    rooms.forEach(function (room) {
      client.to(room).emit('notification', client.id + ' has left the ' + room + ' chat room');
    });
  });
};

exports.default = Chat;