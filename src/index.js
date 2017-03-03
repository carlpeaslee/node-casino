import express from 'express'
import SocketIO from 'socket.io'

import StandardDeck from './config/StandardDeck'
import Dealer from './utils/Dealer'
import {JoBWinnings, JoB} from './config/PayTables/VideoPoker'
import handEvaluator from './utils/handEvaluator'
import template from './config/themes/template'

const app = express()

app.set('port', 3000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

io.on('connection', (client) => {
  client.emit('styling', {
    cardUrl: 'https://a.fsdn.com/con/app/proj/vector-cards/screenshots/Jack_of_Spades.png/1'
  })
  client.emit('payTable', JoB)
  let dealer
  let playerHand
  let bet
  client.on('newGame', (data) => {
    bet = data.bet
    dealer = new Dealer(StandardDeck)
    playerHand = []
    playerHand.push(...dealer.draw(5))
    client.emit('openingHand', {
      playerHand,
      currentValue: handEvaluator(playerHand.slice())
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
})
