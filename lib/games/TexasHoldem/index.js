'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Dealer = require('../../utils/Dealer');

var _Dealer2 = _interopRequireDefault(_Dealer);

var _StandardDeck = require('../../config/StandardDeck');

var _StandardDeck2 = _interopRequireDefault(_StandardDeck);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _getTables = require('../../redis/getTables');

var _getTables2 = _interopRequireDefault(_getTables);

var _joinTable = require('../../redis/joinTable');

var _joinTable2 = _interopRequireDefault(_joinTable);

var _leaveTable = require('../../redis/leaveTable');

var _leaveTable2 = _interopRequireDefault(_leaveTable);

var _checkGamestate = require('../../redis/checkGamestate');

var _checkGamestate2 = _interopRequireDefault(_checkGamestate);

var _takeBlindsAndDeal = require('../../redis/takeBlindsAndDeal');

var _takeBlindsAndDeal2 = _interopRequireDefault(_takeBlindsAndDeal);

var _redis3 = require('../../redis');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TexasHoldem = function TexasHoldem(client, io) {

  (0, _getTables2.default)().then(function (tables, err) {
    client.emit('tables', tables);
  });

  client.on('joinTable', function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { user: user, tableId: tableId };
    return function () {
      var user = data.user,
          tableId = data.tableId;

      client.user = user;

      (0, _joinTable2.default)(tableId, user).then(function (update, err) {
        client.join(tableId, function () {

          (0, _getTables2.default)().then(function (tables, err) {
            client.nsp.emit('tables', tables);
          });

          client.nsp.to(tableId).emit('positions', update);

          (0, _checkGamestate2.default)(tableId).then(function (table, err) {
            var players = seats.filter(function (seat) {
              return seat;
            });
            if (table.gamestate === 'WAITING' && players.length > 1) {
              var newGame = new _Dealer2.default(_StandardDeck2.default);
              var deck = newGame.draw(52).map(function (card) {
                return card.cid;
              });
              (0, _takeBlindsAndDeal2.default)(tableId, deck).then(function (gamestate, err) {
                client.nsp.to(tableId).emit('update', gamestate);
              });
            }
          });
        });
      });
    }();
  });

  client.on('disconnecting', function () {
    var user = client.user,
        rooms = client.rooms;

    var keys = Object.keys(rooms);
    var table = keys.find(function (key) {
      return rooms[key].includes('table');
    });

    if (table && user) {
      (0, _leaveTable2.default)(table, user).then(function (resp, err) {});
    }
  });
};

exports.default = TexasHoldem;