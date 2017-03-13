import Dealer from '../../utils/Dealer'
import redis from 'redis'
import getTables from '../../redis/getTables'
import joinTable from '../../redis/joinTable'
import leaveTable from '../../redis/leaveTable'

import {tex} from '../../redis'

const TexasHoldem = (client, io) => {

  getTables().then( (tables, err) => {
    client.emit('tables', tables)
  })

  client.on('joinTable', (data = {user, tableId}) => {
    let {user, tableId} = data
    client.user = user
    joinTable(tableId, user).then( (seats, err) => {
      client.join(tableId, ()=>{

      })
      client.emit('positions', seats)
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
