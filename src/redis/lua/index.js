import fs from 'fs'
import path from 'path'


const getLua = (fileName) => {
  return fs.readFileSync(path.join(__dirname,`./${fileName}.lua`), 'utf8', (err, source) => {
    return source
  })
}

export default getLua
