'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PayTables = require('./PayTables');

var _handEvaluator = require('../../utils/handEvaluator');

var _handEvaluator2 = _interopRequireDefault(_handEvaluator);

var _StandardDeck = require('../../config/StandardDeck');

var _StandardDeck2 = _interopRequireDefault(_StandardDeck);

var _Dealer = require('../../utils/Dealer');

var _Dealer2 = _interopRequireDefault(_Dealer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var VideoPoker = function VideoPoker(client) {
  client.emit('theme', { theme: 'http://dev-games.gamesmart.com/gamesmart-casino/assets' });
  client.emit('payTable', _PayTables.JoB);
  var dealer = void 0,
      playerHand = void 0,
      bet = void 0;
  client.on('newGame', function (data) {
    var _playerHand;

    bet = data.bet;
    dealer = new _Dealer2.default(_StandardDeck2.default);
    playerHand = [];
    (_playerHand = playerHand).push.apply(_playerHand, _toConsumableArray(dealer.draw(5)));
    client.emit('openingHand', {
      playerHand: playerHand
    });
  });
  client.on('swap', function (discards) {
    discards.forEach(function (discard, index) {
      if (discard) {
        var newCard = dealer.draw(1);
        playerHand[index] = newCard[0];
      }
    });
    var result = (0, _handEvaluator2.default)(playerHand.slice());
    client.emit('result', {
      playerHand: playerHand,
      result: result,
      winnings: (0, _PayTables.JoBWinnings)(result.winningVideoPokerHand, bet)
    });
  });
};

exports.default = VideoPoker;

/*
  Client Listeners

  io.on('theme', {
    theme: 'a url with the root director of the theme assets'
  })

  io.on('payTable', {
    'handName': value,
    'handName': value,
    etc...
  })

  io.on('openingHand', {
    [cardObject, cardObject, etc...]
  })

  io.on('result', {
    playerHand: [cardObject, cardObject],
    result: {
      ...result object describing the hand
    },
    winnings: number
  })

  Client Actions

  io.emit('newGame', {
    bet: number
  })

  io.emit('swap',
    [array of booleans]
  )



*/