import express from 'express'
import StandardDeck from './config/StandardDeck'
import SocketIO from 'socket.io'

const app = express()

app.set('port', 5000)

const server = app.listen(app.get('port'), ()=>{
  console.log(`Server is running at port ${app.get('port')}`)
})

const io = new SocketIO(server)

io.on('connection', (socket) => {
  console.log('connection received')
  socket.on('newGame', (data) => {
    console.log('newGame request', data)
  })
})
