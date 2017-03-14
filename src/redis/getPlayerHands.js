import {tex, convertHands} from './index.js'
import lua from './lua'

const luaGetPlayerHands = lua('getPlayerHands')

const getPlayerHands = (tableId) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaGetPlayerHands, 1, tableId,  (err, res) => {
      resolve(convertHands(res))
    })
  })
}

export default getPlayerHands
