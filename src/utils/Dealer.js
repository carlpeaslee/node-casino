export default class Dealer {
  constructor(deckType, numberOfDecks, ) {
    this.discardPile
    this.deck = []
    for (let i = 0; i < numberOfDecks; i++) {
      this.deck.push(...deckType)
    }
    this.shuffle()
  }

  get current() {
    return this.deck
  }

  shuffle () {
    let temporaryValue
    let randomIndex
    //start at the last card
    let currentIndex = this.deck.length
    //and for each index
    while (currentIndex !== 0) {
      //pick an unshuffled card
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
      //and exchange its place with the current card
      temporaryValue = this.deck[currentIndex]
      this.deck[currentIndex] = this.deck[randomIndex]
      this.deck[randomIndex] = temporaryValue
    }
  }

  draw(number) {
    return this.deck.splice(0, number)
  }

  discard(cards) {
    this.discardPile.push(...cards)
  }

  burn(number) {
    this.discardPile.push(...this.deck.splice(0,number))
  }


}
