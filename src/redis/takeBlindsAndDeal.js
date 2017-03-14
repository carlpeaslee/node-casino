import {tex, convert} from './index.js'
import lua from './lua'

const luaTakeBlindsAndDeal = lua('takeBlindsAndDeal')

const takeBlindsAndDeal = (tableId, deck) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaTakeBlindsAndDeal, 1, tableId, ...deck, (err, res) => {
      resolve(convert(res))
    })
  })
}

export default takeBlindsAndDeal
