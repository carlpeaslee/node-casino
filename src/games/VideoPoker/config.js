const config = {
  payTable: [
    {
      combo: 'Royal Flush',
      payout: 800,
      id: 0
    },
    {
      combo: 'Straight Flush',
      payout: 50,
      id: 1
    },
    {
      combo: 'Four of a Kind',
      payout: 25,
      id: 2
    },
    {
      combo: 'Full House',
      payout: 9,
      id: 3
    },
    {
      combo: 'Flush',
      payout: 6,
      id: 4
    },
    {
      combo: 'Straight',
      payout: 4,
      id: 5
    },
    {
      combo: 'Three of a Kind',
      payout: 3,
      id: 6
    },
    {
      combo: 'Two Pair',
      payout: 2,
      id: 7
    },
    {
      combo: 'Jacks or Better',
      payout: 1,
      id: 8
    },
    {
      combo: 'No Win',
      payout: 0,
      id: 9
    },
  ],
  maxMod: 5,
  maxBet: 5
}

winnings = (bet, modifier, comboId) => {
  return bet * modifier * config.paytable[hand].payout
}

export default config
