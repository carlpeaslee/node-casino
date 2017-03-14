import {tex} from './index.js'
import lua from './lua'

const luaJoinTable = lua('joinTable')

const joinTable = (tableId, user) => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaJoinTable, 1, tableId, tableId, user, (err, res) => {
      // let positions = new Array(5).fill(false)
      // res.forEach( (value, index) => {
      //   if ( (index + 1) % 2 === 0 ) {
      //     positions[parseInt(value) - 1] = res[index - 1]
      //   }
      // })
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

export default joinTable
