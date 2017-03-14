import {tex} from './index.js'
import lua from './lua'

const luaInit = lua('init')

const init = () => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaInit, 0, (err, res) => {
      resolve(res)
    })
  })
}

export default init
