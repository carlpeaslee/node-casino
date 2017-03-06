'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var JoB = exports.JoB = {
  'Royal Flush': 800,
  'Straight Flush': 50,
  'Four of a Kind': 25,
  'Full House': 9,
  'Flush': 6,
  'Straight': 4,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Jacks or Better': 1
};

var JoBWinnings = exports.JoBWinnings = function JoBWinnings(result, bet) {
  var key = Object.keys(JoB).find(function (payoutKey) {
    return payoutKey === result;
  });
  if (!key) {
    return 0;
  } else {
    return JoB[key] * bet;
  }
};