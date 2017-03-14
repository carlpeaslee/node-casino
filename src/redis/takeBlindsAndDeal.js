import {tex} from './index.js'
import lua from './lua'

const luaTakeBlindsAndDeal = lua('takeBlindsAndDeal')

const takeBlindsAndDeal = (tableId, deck) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaTakeBlindsAndDeal, 1, tableId, ...deck, (err, res) => {
      console.log(res)
      let gamestate = {}
      res.forEach( (value, index) => {
        if ( index % 2 === 0) {
          if (Array.isArray(res[index + 1])) {
            let playerObject = {}
            res[index + 1].forEach( (item, i) => {
              if (i % 2 === 0) {
                Object.assign(playerObject, {
                  [item]: res[index + 1][i + 1]
                })
              }
            })
            Object.assign(gamestate, {
              [value]: playerObject
            })
          } else {
            Object.assign(gamestate, {
              [value]: res[index + 1]
            })
          }
        }
      })

      resolve(gamestate)
    })
  })
}

export default takeBlindsAndDeal
