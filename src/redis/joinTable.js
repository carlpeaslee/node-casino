import {tex} from './index.js'
import lua from './lua'

const luaJoinTable = lua('joinTable')

const joinTable = (tableId, user) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaJoinTable, 1, tableId, tableId, user, (err, res) => {
      let positions = new Array(5).fill(false)
      res.forEach( (value, index) => {
        if ( (index + 1) % 2 === 0 ) {
          positions[parseInt(value) - 1] = res[index - 1]
        }
      })
      resolve(positions)
    })
  })
}

export default joinTable
