const HandEvaluator = (hand) => {
  return {
    ...flush(hand),
    
  }
}

const flush = (hand) => {
  for (let card in hand) {
    if (card.suit !== hand[0].suit) {
      return {
        flush: false,
        flushSuit: false,
      }
    }
  }
  return {
    flush: true,
    flushSuit: hand[0].suit
  }
}

const straight = (hand) => {
  let sortedHand = hand.sort( (a,b) => {
    return a.rank - b.rank
  })
  for (let i = 0; i < sortedHand.length; i++) {
  //  if (sortedHand[i].rank)
  }
}

export default HandEvaluator
