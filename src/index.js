import express from 'express'
import SocketIO from 'socket.io'

import StandardDeck from './config/StandardDeck'
import Dealer from './utils/Dealer'
import {JoBCalc} from './config/PayTables/VideoPoker'

const app = express()

app.set('port', 3000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

io.on('connection', client => {
  console.log('connection received')
  let dealer = new Dealer(StandardDeck)
  let playerHand = []
  client.on('newGame', data => {
    console.log('newGame request', data)
    playerHand.push(...dealer.draw(5))
    client.emit('openingHand', playerHand)
  })
  client.on('swap', discards => {
    console.log("swap", discards)
    discards.forEach( (discard, index) => {
      if (discard) {
        let newCard = dealer.draw(1)
        let oldCard = playerHand.splice(index,1, ...newCard)
        dealer.discard(oldCard)
      }
    })
    client.emit('newCards', playerHand)
  })
})
