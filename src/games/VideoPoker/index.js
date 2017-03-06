import {JoBWinnings, JoB} from './PayTables'
import handEvaluator from 'utils/handEvaluator'
import StandardDeck from 'config/StandardDeck'
import Dealer from 'utils/Dealer'


const VideoPoker = (client) => {
  client.emit('theme', {theme: false})
  client.emit('payTable', JoB)
  let dealer, playerHand, bet
  client.on('newGame', (data) => {
    bet = data.bet
    dealer = new Dealer(StandardDeck)
    playerHand = []
    playerHand.push(...dealer.draw(5))
    client.emit('openingHand', {
      playerHand,
    })
  })
  client.on('swap', (discards) => {
    discards.forEach( (discard, index) => {
      if (discard) {
        let newCard = dealer.draw(1)
        playerHand[index] = newCard[0]
      }
    })
    let result = handEvaluator(playerHand.slice())
    client.emit('result', {
      playerHand,
      result,
      winnings: JoBWinnings(result.winningVideoPokerHand, bet)
    })
  })
}

export default VideoPoker
