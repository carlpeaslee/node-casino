import {tex, convert} from './index.js'
import lua from './lua'

const luaJoinTable = lua('joinTable')

const joinTable = (tableId, user) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaJoinTable, 1, tableId, tableId, user, (err, res) => {
      
      resolve(convert(res))
    })
  })
}

export default joinTable
