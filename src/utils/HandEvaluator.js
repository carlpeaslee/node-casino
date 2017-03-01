const HandEvaluator = (hand) => {



}

const isFlush = (hand) => {
  for (let card in hand) {
    if (card.suit !== hand[0].suit) {
      return false
    }
  }
  return true
}

const isStraight = (hand) => {
  let sortedHand = hand.sort( (a,b) => {
    return a.rank - b.rank
  })
  for (let i = 0; i < sortedHand.length; i++) {
  //  if (sortedHand[i].rank)
  }
}

export default HandEvaluator
