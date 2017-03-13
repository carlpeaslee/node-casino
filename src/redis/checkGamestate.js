import {tex} from './index.js'
import lua from './lua'

const luaCheckGamestate = lua('checkGamestate')

const checkGamestate = (tableId) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaCheckGamestate, 1, tableId, (err, res) => {
      let table = {
        gamestate: false,
        activePlayer: false
      }
      res.forEach( (value, index) => {
        if (value === 'gamestate') {
          table.gamestate = res[index + 1]
        }
        if (value === 'activePlayer') {
          table.gamestate = res[index + 1]
        }
      })

      resolve(table)
    })
  })
}

export default checkGamestate
