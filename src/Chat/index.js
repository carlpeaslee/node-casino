const Chat = (client) => {


  client.join('global', ()=>{
    client.emit('notification',  "You've joined the GameSmart chat room.")
  })


  client.on('join', (roomData = {id, name}) => {
    let {id: room, name} = roomData
    client.join(room, ()=> {
      client.emit('notification', `You've joined the ${name} chat room.`)
      client.to(room).emit('notification', `${client.id} has joined the ${name} chat room.`)
    })
  })

  client.on('disconnecting', ()=>{
    let rooms = Object.keys(client.rooms)
    rooms.forEach( (room) => {
      client.to(room).emit('notification', `${client.id} has left the ${room} chat room`)
    })
  })
}

export default Chat
