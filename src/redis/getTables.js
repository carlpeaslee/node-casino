import {tex} from './index.js'
import lua from './lua'

const luaGetTables = lua('getTables')

const getTables = () => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaGetTables, 0, (err, res) => {
      let tables = []
      let keys = Object.keys(res)
      keys.forEach( (key) => {
        key = parseInt(key)
        if ( ((key + 1) % 2) === 1 ) {
          tables.push({
            tableId: res[key],
            players: res[key+ 1]
          })
        }
        resolve(tables)
      })
    })
  })
}

export default getTables
