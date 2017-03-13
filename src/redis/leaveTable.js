import {tex} from './index.js'
import lua from './lua'

const luaLeaveTable = lua('leaveTable')

const leaveTable = (tableId, user) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaLeaveTable, 1, tableId, user, tableId, (err, res) => {

      resolve()
    })
  })
}

export default leaveTable
