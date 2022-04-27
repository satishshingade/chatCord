const http = require('http');
const express = require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages')
const {userJoin,getCurrentUser,getRoomUsers,userLeave}=require('./utils/users');

const app = express();
const server=http.createServer(app);
const io=socketio(server);

app.use(express.static('./public'));
const bot="chatcord bot  "

io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{

        const user = userJoin(socket.id,username,room);
        socket.join(user.room);

        //welcome current user
         socket.emit('message',formatMessage(bot,'welcome to chatcord !'));

        // boradcast when a user connects  (all clients except the user)
        socket.broadcast.to(user.room).emit('message',formatMessage(bot,`${user.username} user has joined the chat`));

        // users room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });


    });
    



    // listen for chatmessage 
    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

     // broadcast to everybody io.emit disconnects
     socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(bot,`${user.username} user has left the chat`));
        
        // users room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
        
        }
        
    });
});

const PORT = 3000;



// set static foler 

// run when client connects 


server.listen(PORT,()=>{
    console.log("server running !");
});