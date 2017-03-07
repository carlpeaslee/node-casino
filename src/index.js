import express from 'express'
import SocketIO from 'socket.io'
import redis from 'socket.io-redis'

import VideoPoker from './games/VideoPoker'
import Chat from './Chat'

const app = express()

app.set('port', 3000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

// const casionRedis = redis({
//   host: 'gs-dev-redis-t2.vzvxbb.ng.0001.use1.cache.amazonaws.com',
//   port: 6379,
// })
//
// casinoRedis.select(0, ()=>{
//   io.adapter(
//     adapter({pubClient: casinoRedis})
//   )
// })



io.of('/chat').on('connection', Chat)

io.of('/videopoker').on('connection', VideoPoker)
