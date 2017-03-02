export const JoB = {
  'Royal Flush': 800,
  'Straight Flush': 50,
  'Four of a Kind': 25,
  'Full House': 9,
  'Flush': 6,
  'Straight': 4,
  'Three of a Kind': 3,
  'Two Pair': 2,
  'Jack High Pair': 1
}

export const JoBCalc = (hand, bet) => {
  let key = Object.keys(JoB).find((payoutKey)=>{
    return payoutKey === hand.value
  })
  if (!key) {
    return 0
  } else {
    return JoB[key] * bet
  }
}
