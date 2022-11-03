const express = require('express');
const colors = require('colors');
const path = require('path');
const {createServer} = require('http');
const {Server} = require('socket.io');
const { readFileSync, writeFileSync } = require('fs');



        // init express
        const app = express()


        // create express server to row server
        const httpServer = createServer(app)


        // socket server init 
        const io = new Server(httpServer)

        // create aconection to client
         io.on('connection', (socket) => {

            // latestchat
            let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString())

            io.sockets.emit('latestChat', latestChat)


            socket.on('chat', ({name, photo, message}) => {

                let oldChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString())

                oldChat.push({name, photo, message});

                writeFileSync(path.join(__dirname, 'db/chat.json'), JSON.stringify(oldChat))


                // latestchat
                let latestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/chat.json')).toString())

                io.sockets.emit('latestChat', latestChat)
            })






            // client connection
            console.log('Client Connected Successful'.bgYellow.black);
            // cleint disclient
            socket.on('disconnect', () => {
                socket.send('leave this chat group');
                console.log('client disconnetd'.bgRed.black);
            })
         })


        // load client
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, "index.html"))
        })


        app.use(express.static(path.join(__dirname, '')))


        // server listent
        httpServer.listen(5050, () => {
            console.log(`server is runing successful 5050`.bgCyan.black);
        })