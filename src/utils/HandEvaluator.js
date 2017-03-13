const handEvaluator = (inputHand) => {
  const hand = inputHand
  let result = {
    ...flush(hand),
    ...straight(hand),
    ...multiples(hand),
  }
  result = {
    ...result,
    ...straightFlush(result, hand)
  }
  result = {
    ...result,
    ...royalFlush(result, hand)
  }
  result = {
    ...result,
    ...winningVideoPokerHand(result)
  }
  return result
}

const flush = (hand) => {
  let result = {
    HEARTS: 0,
    SPADES: 0,
    CLUBS: 0,
    DIAMONDS: 0
  }
  hand.forEach( (card) => {
    result = {
      ...result,
      [card.suit]: result[card.suit] + 1
    }
  })

  for (let key in result) {
    if (result[key] > 4) {
      result = {
        ...result,
        flush: true,
        flushSuit: key,
      }
    }
  }

  if (result.flush) {
    hand.forEach( (card) => {
      let flushRanks = []
      if (card.suit === result.flushSuit) {
        flushRanks.push(card.rank)
      }
      result = {
        ...result,
        flushHighCard: Math.max(...flushRanks)
      }
    })
  }

  if (!result.flush) {
    result = {
      ...result,
      flush: false,
    }
  }

  return result
}

const straight = (hand) => {
  let result = {}
  let sortedHand = hand.sort( (a,b) => {
    return a.rank - b.rank
  })
  let last = sortedHand.length - 1
  if (hand.length === 5) {
    if (
      sortedHand[last].rank === 14 &&
      sortedHand[0].rank === 2 &&
      sortedHand[1].rank === 3 &&
      sortedHand[2].rank === 4 &&
      sortedHand[3].rank === 5
    ) {
      result = {
        ...result,
        straight: true,
        straightHighCard: 5
      }
    } else {
      sortedHand.forEach( (card, index) => {
        if ( (hand[0].rank - hand[index].rank) === index ) {
          result = {
            ...result,
            straight: true,
          }
        } else {
          result = {
            ...result,
            straight: false,
          }
        }
      })
      if (result.straight) {
        result = {
          ...result,
          straightHighCard: sortedHand[last].rank
        }
      }
    }
  }
  return result
}

const multiples = (hand) => {
  let result = {}
  let copies = Array(15).fill(0)
  hand.forEach( (card) => {
    copies[card.rank] = copies[card.rank] + 1
  })
  let pairValues = []
  let threeOfAKindValues = []
  let fourOfAKindValues = []
  copies.forEach( (rank, index) => {
    switch (rank) {
      case 2: {
        pairValues.push(index)
        break
      }
      case 3: {
        threeOfAKindValues.push(index)
        break
      }
      case 4: {
        fourOfAKindValues.push(index)
        break
      }
      default: {
        break
      }
    }
  })
  if (pairValues.length > 0) {
    result = {
      ...result,
      pair: true,
      pairValues
    }
  }
  if (threeOfAKindValues.length > 0) {
    result = {
      ...result,
      threeOfAKind: true,
      threeOfAKindValues
    }
  }
  if (fourOfAKindValues.length > 0) {
    result = {
      ...result,
      fourOfAKind: true,
      fourOfAKindValues
    }
  }
  if (result.pair && result.threeOfAKind) {
    result = {
      ...result,
      fullHouse: true
    }
  }
  return result
}

const straightFlush = (result, hand) => {
  if (result.flush && result.straight) {
    return {
      straightFlush: true,
    }
  }
}

const royalFlush = (result, hand) => {
  if (result.straightFlush && result.straightHighCard === 14 && result.flushHighCard === 14) {
    return {
      royalFlush: true,
    }
  }
}

const winningVideoPokerHand = (result) => {
  if (result.royalFlush) {
    return {
      winningVideoPokerHand: 'Royal Flush'
    }
  } else if (result.straightFlush) {
    return {
      winningVideoPokerHand: 'Straight Flush'
    }
  } else if (result.fourOfAKind) {
    return {
      winningVideoPokerHand: 'Four of a Kind'
    }
  } else if (result.fullHouse) {
    return {
      winningVideoPokerHand: 'Full House'
    }
  } else if (result.flush) {
    return {
      winningVideoPokerHand: 'Flush'
    }
  } else if (result.straight) {
    return {
      winningVideoPokerHand: 'Straight'
    }
  } else if (result.threeOfAKind) {
    return {
      winningVideoPokerHand: 'Three of a Kind'
    }
  } else if (result.pair && result.pairValues.length === 2) {
    return {
      winningVideoPokerHand: 'Two Pair'
    }
  } else if (result.pair && Math.max(...result.pairValues) >= 11) {
    return {
      winningVideoPokerHand: 'Jacks or Better'
    }
  } else {
    return {
      winningVideoPokerHand: 'Bust'
    }
  }
}

export default handEvaluator
