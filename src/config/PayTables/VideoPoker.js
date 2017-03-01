export const JoB = {
  'ROYAL_FLUSH': 800,
  'STRAIGHT_FLUSH': 50,
  'FOUR_OF_A_KIND': 25,
  'FULL_HOUSE': 9,
  'FLUSH': 6,
  'STRAIGHT': 4,
  'THREE_OF_A_KIND': 3,
  'TWO_PAIR': 2,
  'JACK_HIGH_PAIR': 1
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
