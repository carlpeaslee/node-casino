'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handEvaluator = function handEvaluator(hand) {
  var result = _extends({}, flush(hand), straight(hand), multiples(hand));
  result = _extends({}, result, straightFlush(result, hand));
  result = _extends({}, result, royalFlush(result, hand));
  result = _extends({}, result, winningVideoPokerHand(result));
  return result;
};

var flush = function flush(hand) {
  var result = {
    HEARTS: 0,
    SPADES: 0,
    CLUBS: 0,
    DIAMONDS: 0
  };
  hand.forEach(function (card) {
    result = _extends({}, result, _defineProperty({}, card.suit, result[card.suit] + 1));
  });

  for (var key in result) {
    if (result[key] > 4) {
      result = _extends({}, result, {
        flush: true,
        flushSuit: key
      });
    }
  }

  if (result.flush) {
    hand.forEach(function (card) {
      var flushRanks = [];
      if (card.suit === result.flushSuit) {
        flushRanks.push(card.rank);
      }
      result = _extends({}, result, {
        flushHighCard: Math.max.apply(Math, flushRanks)
      });
    });
  }

  if (!result.flush) {
    result = _extends({}, result, {
      flush: false
    });
  }

  return result;
};

var straight = function straight(hand) {
  var result = {};
  var sortedHand = hand.sort(function (a, b) {
    return a.rank - b.rank;
  });
  var last = sortedHand.length - 1;
  if (hand.length === 5) {
    if (sortedHand[last].rank === 14 && sortedHand[0].rank === 2 && sortedHand[1].rank === 3 && sortedHand[2].rank === 4 && sortedHand[3].rank === 5) {
      result = _extends({}, result, {
        straight: true,
        straightHighCard: 5
      });
    } else {
      sortedHand.forEach(function (card, index) {
        if (hand[0].rank - hand[index].rank === index) {
          result = _extends({}, result, {
            straight: true
          });
        } else {
          result = _extends({}, result, {
            straight: false
          });
        }
      });
      if (result.straight) {
        result = _extends({}, result, {
          straightHighCard: sortedHand[last].rank
        });
      }
    }
  }
  return result;
};

var multiples = function multiples(hand) {
  var result = {};
  var copies = Array(15).fill(0);
  hand.forEach(function (card) {
    copies[card.rank] = copies[card.rank] + 1;
  });
  var pairValues = [];
  var threeOfAKindValues = [];
  var fourOfAKindValues = [];
  copies.forEach(function (rank, index) {
    switch (rank) {
      case 2:
        {
          pairValues.push(index);
          break;
        }
      case 3:
        {
          threeOfAKindValues.push(index);
          break;
        }
      case 4:
        {
          fourOfAKindValues.push(index);
          break;
        }
      default:
        {
          break;
        }
    }
  });
  if (pairValues.length > 0) {
    result = _extends({}, result, {
      pair: true,
      pairValues: pairValues
    });
  }
  if (threeOfAKindValues.length > 0) {
    result = _extends({}, result, {
      threeOfAKind: true,
      threeOfAKindValues: threeOfAKindValues
    });
  }
  if (fourOfAKindValues.length > 0) {
    result = _extends({}, result, {
      fourOfAKind: true,
      fourOfAKindValues: fourOfAKindValues
    });
  }
  if (result.twoOfAKind && result.threeOfAKind) {
    result = _extends({}, result, {
      fullHouse: true
    });
  }
  return result;
};

var straightFlush = function straightFlush(result, hand) {
  if (result.flush && result.straight) {
    return {
      straightFlush: true
    };
  }
};

var royalFlush = function royalFlush(result, hand) {
  if (result.straightFlush && result.straightHighCard === 14 && result.flushHighCard === 14) {
    return {
      royalFlush: true
    };
  }
};

var winningVideoPokerHand = function winningVideoPokerHand(result) {
  if (result.royalFlush) {
    return {
      winningVideoPokerHand: 'Royal Flush'
    };
  } else if (result.straightFlush) {
    return {
      winningVideoPokerHand: 'Straight Flush'
    };
  } else if (result.fourOfAKind) {
    return {
      winningVideoPokerHand: 'Four of a Kind'
    };
  } else if (result.fullHouse) {
    return {
      winningVideoPokerHand: 'Full House'
    };
  } else if (result.flush) {
    return {
      winningVideoPokerHand: 'Flush'
    };
  } else if (result.straight) {
    return {
      winningVideoPokerHand: 'Straight'
    };
  } else if (result.threeOfAKind) {
    return {
      winningVideoPokerHand: 'Three of a Kind'
    };
  } else if (result.twoPair) {
    return {
      winningVideoPokerHand: 'Two Pair'
    };
  } else if (result.pair && Math.max.apply(Math, _toConsumableArray(result.pairValues)) >= 11) {
    return {
      winningVideoPokerHand: 'Jack High Pair'
    };
  } else {
    return {
      winningVideoPokerHand: false
    };
  }
};

exports.default = handEvaluator;