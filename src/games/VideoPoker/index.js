import handEvaluator from '../../utils/handEvaluator'
import StandardDeck from '../../config/StandardDeck'
import Dealer from '../../utils/Dealer'
import config, {winnings} from './config'

const VideoPoker = (client) => {
  client.emit('theme', {theme: 'http://dev-games.gamesmart.com/gamesmart-casino/assets'})
  client.emit('config', config)
  let dealer, playerHand, bet, mod
  client.on('newGame', (data) => {
    mod = data.mod
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
    let combo = handEvaluator(playerHand.slice())
    client.emit('result', {
      playerHand,
      combo,
      payout: winnings(bet, mod, combo)
    })
  })
}

export default VideoPoker


/*
  Client Listeners

  io.on('theme', {
    theme: 'a url with the root director of the theme assets'
  })

  io.on('payTable', {
    'handName': value,
    'handName': value,
    etc...
  })

  io.on('openingHand', {
    [cardObject, cardObject, etc...]
  })

  io.on('result', {
    playerHand: [cardObject, cardObject],
    result: {
      ...result object describing the hand
    },
    winnings: number
  })

  Client Actions

  io.emit('newGame', {
    bet: number
  })

  io.emit('swap',
    [array of booleans]
  )



*/
