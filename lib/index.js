'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _StandardDeck = require('./config/StandardDeck');

var _StandardDeck2 = _interopRequireDefault(_StandardDeck);

var _Dealer = require('./utils/Dealer');

var _Dealer2 = _interopRequireDefault(_Dealer);

var _VideoPoker = require('./config/PayTables/VideoPoker');

var _handEvaluator = require('./utils/handEvaluator');

var _handEvaluator2 = _interopRequireDefault(_handEvaluator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = (0, _express2.default)();

app.set('port', 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Server is running at port ' + app.get('port'));
});

var io = new _socket2.default(server);

io.on('connection', function (client) {
  console.log('connection received');
  client.emit('payTable', _VideoPoker.JoB);
  var dealer = void 0;
  var playerHand = void 0;
  client.on('newGame', function (data) {
    var _playerHand;

    dealer = new _Dealer2.default(_StandardDeck2.default);
    playerHand = [];
    (_playerHand = playerHand).push.apply(_playerHand, _toConsumableArray(dealer.draw(5)));
    client.emit('openingHand', playerHand);
  });
  client.on('swap', function (discards) {
    discards.forEach(function (discard, index) {
      if (discard) {
        var _playerHand2;

        var newCard = dealer.draw(1);
        var oldCard = (_playerHand2 = playerHand).splice.apply(_playerHand2, [index, 1].concat(_toConsumableArray(newCard)));
        dealer.discard(oldCard);
      }
    });
    client.emit('result', {
      playerHand: playerHand,
      result: (0, _handEvaluator2.default)(playerHand)
    });
  });
});