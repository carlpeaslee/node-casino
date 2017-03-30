import {tex, convert} from './index.js'
import lua from './lua'
import pokersolver, {Hand} from 'pokersolver'
const luaManager = lua('manager')

const manager = (tableId, user, actionObject) => {
  let action
  if (!actionObject) {
    action = 'none'
  } else if (actionObject.type === 'bet') {
    action = actionObject.wager
  } else if (actionObject.type === 'fold') {
    action = 'fold'
  }
  return new Promise( (resolve, reject) => {
    tex.eval(luaManager, 2, tableId, user, action, (err, res) => {
      if (err) {
        console.log("err", err)
      }

      let update = convert(res)

      if (update.showdown) {
        let {table} = update
        let solutions = []
        update.occupiedSeats.forEach( (seat) => {
          let {cards} = update[seat]
          let combined = table.concat(cards)
          let solution = Hand.solve(combined)
          Object.assign(solution, {userId: update[seat].player})
          solutions.push(solution)
        })
        let winners = Hand.winners(solutions)
        update.winner = []
        winners.forEach((winner)=> {
          update.winner.push(winner.userId)
        })
      }

      resolve(update)
    })
  })
}

export default manager
