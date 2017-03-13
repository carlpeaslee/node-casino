import express from 'express'
import SocketIO from 'socket.io'
import adapter from 'socket.io-redis'

import VideoPoker from './games/VideoPoker'
// import TexasHoldem from './games/TexasHoldem'

import Chat from './Chat'

const app = express()

app.set('port', 3000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

io.of('/chat').on('connection', Chat)

io.of('/videopoker').on('connection', VideoPoker)


// io.of('/texasholdem').on('connection', (client) => {
//   TexasHoldem(client, io)
// })
