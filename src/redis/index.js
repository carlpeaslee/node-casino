import redis from 'redis'
export const tex = redis.createClient()


export const convert = (res) => {
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
  return gamestate
}


export const convertHands = (res) => {
  let hands = {}
  res.forEach( (value, index) => {
    if ( index % 2 === 0) {
      Object.assign(hands, {
        [value]: res[index + 1]
      })
    }
  })
  return hands
}
