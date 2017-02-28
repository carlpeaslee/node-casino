"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Deck = function () {
  function Deck(deckType, numberOfDecks) {
    _classCallCheck(this, Deck);

    this.deck = [];
    for (var i = 0; i < numberOfDecks; i++) {
      this.deck.push(deckType);
    }
    console.log(this.deck);
  }

  _createClass(Deck, [{
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

      console.log("shuffled", this.deck);
    }
  }]);

  return Deck;
}();

exports.default = Deck;