import {tex} from './index.js'
import lua from './lua'

const luaTakeBlindsAndDeal = lua('takeBlindsAndDeal')

const takeBlindsAndDeal = (tableId, deck) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaTakeBlindsAndDeal, 1, tableId, ...deck, (err, res) => {
      console.log('takeBlindsAndDeal', res, err)

      resolve()
    })
  })
}

export default takeBlindsAndDeal
