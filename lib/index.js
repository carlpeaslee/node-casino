'use strict';

var _Deck = require('./utils/Deck');

var _Deck2 = _interopRequireDefault(_Deck);

var _StandardDeck = require('./config/StandardDeck');

var _StandardDeck2 = _interopRequireDefault(_StandardDeck);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var myDeck = new _Deck2.default(_StandardDeck2.default, 1);

console.log('hello world');