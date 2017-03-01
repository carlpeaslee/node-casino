"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var HandEvaluator = function HandEvaluator(hand) {};

var isFlush = function isFlush(hand) {
  for (var card in hand) {
    if (card.suit !== hand[0].suit) {
      return false;
    }
  }
  return true;
};

var isStraight = function isStraight(hand) {
  var sortedHand = hand.sort(function (a, b) {
    return a.rank - b.rank;
  });
  for (var i = 0; i < sortedHand.length; i++) {
    //  if (sortedHand[i].rank)
  }
};

exports.default = HandEvaluator;