import express from 'express'
import SocketIO from 'socket.io'
import VideoPoker from 'games/VideoPoker'

const app = express()

app.set('port', 3000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

io.of('/videopoker').on('connection', VideoPoker)
