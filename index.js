const ws = require('ws')


const PORT = process.env.PORT || 1337

// store all the users in an object.
let users = { }

const server = new ws.Server({ port : PORT })
console.log(`WebSocket server started listening on port ${PORT}`)

const sendTo = (conn, msg) => {
  conn.send(JSON.stringify(msg))
}

const handleMessage = (connection) => (message) => {

  let data 
  try {
    data = JSON.parse(message)
  } catch(e) {
    console.log('Invalid JSON')
    data = {}
  }

  let conn = null

  switch(data.type) {

    case 'login':
      if(users[data.name]) {
        sendTo(connection, { type: 'login', sucess: false })
      } else {
        users[data.name] = connection
        connection.name = data.name
        sendTo(connection, { type: 'login', sucess: true })
      }
      break

    case 'offer':
      conn = user[data.name]
      if(conn != null) {
        connection.otherName = data.name
        sendTo(conn, { type: 'offer',  offer: data.offer, name: connection.name })
      }
      break

    case 'answer':
      conn = users[data.name]
      if(conn != null) {
        connection.otherName = data.name
        sendTo(conn, { type: 'answer', answer: data.answer })
      }
      break

    case 'candidate':
      conn = users[data.name]
      if( conn != null) {
        sendTo(conn, { type: 'candidate', candidate: data.candidate })
      }
    break

    case 'leave':
      conn = users[data.name]
      conn.otherName = null

      if(conn != null) {
        sendTo(conn, { type: 'leave' })
      }
      break

    default:
      sendTo(connection, { type: 'error', message: 'command not found: ' + data.type })
      break
    }

}

const closeConnection = (connection) => () => {
    if(connection.name) {
      delete users[connection.name]

      // send message to all the peers connected to it.
    }
}

server.on('connection', (connection) => {

  connection.on('message', handleMessage(connection))

  connection.on('close', closeConnection(connection))
})




