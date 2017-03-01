"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dealer = function () {
  function Dealer(deckType, numberOfDecks) {
    _classCallCheck(this, Dealer);

    this.discardPile;
    this.deck = [];
    for (var i = 0; i < numberOfDecks; i++) {
      var _deck;

      (_deck = this.deck).push.apply(_deck, _toConsumableArray(deckType));
    }
    this.shuffle();
  }

  _createClass(Dealer, [{
    key: "shuffle",
    value: function shuffle() {
      var temporaryValue = void 0;
      var randomIndex = void 0;
      //start at the last card
      var currentIndex = this.deck.length;
      //and for each index
      while (currentIndex !== 0) {
        //pick an unshuffled card
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        //and exchange its place with the current card
        temporaryValue = this.deck[currentIndex];
        this.deck[currentIndex] = this.deck[randomIndex];
        this.deck[randomIndex] = temporaryValue;
      }
    }
  }, {
    key: "draw",
    value: function draw(number) {
      return this.deck.splice(0, number);
    }
  }, {
    key: "discard",
    value: function discard(cards) {
      var _discardPile;

      (_discardPile = this.discardPile).push.apply(_discardPile, _toConsumableArray(cards));
    }
  }, {
    key: "burn",
    value: function burn(number) {
      var _discardPile2;

      (_discardPile2 = this.discardPile).push.apply(_discardPile2, _toConsumableArray(this.deck.splice(0, number)));
    }
  }, {
    key: "current",
    get: function get() {
      return this.deck;
    }
  }]);

  return Dealer;
}();

exports.default = Dealer;