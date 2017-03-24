import {tex, convert} from './index.js'
import lua from './lua'

const luaManager = lua('manager')

const manager = (tableId, user, action = 'none') => {
  return new Promise( (resolve, reject) => {
    tex.eval(luaManager, 2, tableId, user, action, (err, res) => {
      console.log(err, res)
      resolve(convert(res))
    })
  })
}

export default manager
