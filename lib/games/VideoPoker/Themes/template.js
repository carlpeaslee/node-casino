"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var template = {
  theme: true,
  cardBack: "", //url of a 5x7 image representing the back of the cards
  cards: [
    /*
      an array of 52 urls, each corresponding to a different card
      cards should be ordered first by suit (spades, hearts, clubs, diamonds)
      and then by rank, starting with 2 and ending with Ace
    */
  ],
  payoutImage: "", //url of a scalable image representing the background of the payout table
  buttonTextColor: "", //hex, rgb, or css colorname for the text on the buttons
  cardHoldOutline: "", //hex, rgb, or css colorname for the outline of held cards
  fontFamily: "", //font family to apply to all text
  payoutKeyColor: "", //hex, rgb, or css colorname for hand names
  payoutValueColor: "" };

exports.default = template;