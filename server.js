/* 
-   samvad-(version-0.0.4)
-   File: /server.js
*/

const express = require("express")  // serving frontend files
const http = require("http")    // core HTTP server
const { Server } = require("socket.io")     // Socket.io for real-time chat

const { Client, Room, Chat } = require("./client")

// const fs = require('fs')
// const path = require('path')

const app = express()

// const log_file = path.join(__dirname, 'status.log') // server log file

// Create HTTP server and attach express app
const server = http.createServer(app)

// Attach Socket.io to the HTTP server
const io = new Server(server)

/* Serve static files from "public" folder (frontend HTML, CSS, JS) */

app.use(express.static("public"))

// let members = []

let rooms = [
    new Room('public')
]

/* handle socket connection listen client request */

io.on("connection", (socket) => {
    
    // login request
    
    socket.on('login', (client) => {
        
        let existRoom = rooms.find((room) => room.name === client.room)
        
        if (!existRoom) {
            existRoom = new Room(client.room) 
            rooms.push(existRoom)
        }
        let isExist = existRoom.members.find((member) => member.name === client.name || member.isOnline === false)

        if (isExist) {
       
            isExist.id = socket.id
            isExist.isOnline = true
       
        } else {

            existRoom.addClient(new Client(socket.id, client.name))
        }
        socket.join(client.room)

        if (existRoom.chats.length != 0) {
        
            socket.emit("beforeChat", existRoom.chats.map((chat) => chat.toJSON()));
        }
        io.to(existRoom.name).emit('members', existRoom.members.map((member) => member.toJSON()))

        console.log(`[+] ${client.name} is connected`)
    })

    // message request

    socket.on('message', (request) => {

        let existRoom = rooms.find((room) => room.memberExist(socket.id))

        if (!existRoom) {
            console.warn('~ room is not exist for message')
            return
        }
        existRoom.broadcast(io, request)
    })

    // logout request

    socket.on('logout', (request) => {
        
        let existRoom = rooms.find((room) => room.memberExist(socket.id))

        if (!existRoom) {
            console.warn('~ room is not exist for logout')
            return
        }

        let member = existRoom.getClient(socket.id)
        
        if (!member) {
            console.warn('~ member is null for logout')
            return
        }
        existRoom.removeClient(member)

        io.to(existRoom.name).emit('members', existRoom.members.map((member) => member.toJSON()))
    })

    // disconnect request

    socket.on('disconnect', (request) => {

        let existRoom = rooms.find((room) => room.memberExist(socket.id))

        if (!existRoom) {
            console.warn('~ room is not exist for disconnect')
            return
        }

        let member = existRoom.getClient(socket.id)
        
        if (!member) {
            console.warn('~ member is null for disconnect')
            return
        }
        existRoom.removeClient(member)

        io.to(existRoom.name).emit('members', existRoom.members.map((member) => member.toJSON()))
        
        console.log(existRoom.toJSON())
        console.log(`[-] ${member} is disconnect ${request}`)
    })
})

/* server active */

server.listen(3000, () => {
  
    console.log("~ server is (active) listening on ( http://localhost:3000 )");
})

/* Developed by Mayank | ( https://github.com/MayankDevil/ ) */