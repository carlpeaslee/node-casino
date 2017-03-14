import Dealer from '../../utils/Dealer'
import StandardDeck from '../../config/StandardDeck'
import redis from 'redis'
import getTables from '../../redis/getTables'
import joinTable from '../../redis/joinTable'
import leaveTable from '../../redis/leaveTable'
import takeBlindsAndDeal from '../../redis/takeBlindsAndDeal'
import getPlayerHands from '../../redis/getPlayerHands'

import {tex} from '../../redis'

const TexasHoldem = (client, io) => {

  getTables().then( (tables, err) => {
    client.emit('tables', tables)
  })

  client.on('joinTable', (data = {user, tableId}) => {
    let {user, tableId} = data
    client.join(user)

    joinTable(tableId, user).then( (update, err) => {
      client.join(tableId, ()=>{

        getTables().then( (tables, err) => {
          client.nsp.emit('tables', tables)
        })

        client.nsp.to(tableId).emit('update', update)

        if (update.gamestate === 'WAITING' && parseInt(update.players) > 1) {
          let newGame = new Dealer(StandardDeck)
          let deck = newGame.draw(52).map( card => card.cid)
          takeBlindsAndDeal(tableId, deck).then( (gamestate, err) => {
            client.nsp.to(tableId).emit('update', gamestate)

            getPlayerHands(tableId).then( (result, err) => {
              let keys = Object.keys(result)
              keys.forEach( (player) => {
                client.nsp.to(player).emit('cards', result[player])
              })
            })
          })
        }
      })
    })
  })


  client.on('disconnecting', ()=> {
    let {user, rooms} = client
    let keys = Object.keys(rooms)
    let table = keys.find( (key) => {
      return rooms[key].includes('table')
    })

    if (table && user) {
      leaveTable(table, user).then( (resp, err) => {

      })
    }
  })

}

export default TexasHoldem
