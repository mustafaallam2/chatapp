const express = require('express');
const http = require('http');
const path = require('path');
const hbs = require('hbs');
const socketio= require('socket.io');
const Filter = require('bad-words');
const messages = require('./utils/messages');
const chatUsers = require('./utils/users');



const app = express();
const server = http.createServer(app);
const io = socketio(server);

// define paths for express config 
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//set up view engin and view location 
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//set up static directory to serve 
app.use(express.static(publicPath));


io.on('connection' , (socket)=>{
    
    socket.on('join',(data,callback)=>{
       const user= chatUsers.addUser({
            id:socket.id,
            username : data.username,
            room: data.room
        })
        if (user.error) {
          return callback(user.error)
            
        }
        socket.join(user.room);
        //on connection send welcome to the connected user and new user joined for the chat room
        socket.emit('message', messages.generateMessage({text:'welcome',username:'system'}));
        socket.broadcast.to(user.room).emit('message', messages.generateMessage({text:`${user.username} has joined`,username:'system'}));
      
        //send room data to all users in the room when user disconnect 

        io.to(user.room).emit('roomData',{
            roomName: user.room,
            users:chatUsers.getUsersInRoom(user.room)
        })
        callback()
    })



    //listen for sendMessage event  
    socket.on('sendMessage',(message,callback)=>{
        filter = new Filter();
        if (filter.isProfane(message) || message==='') {
            return callback('invalid message');
        }
        user = chatUsers.getUser(socket.id)
        
        io.to(user.room).emit('message', messages.generateMessage({text:message,username:user.username}));
        callback();
    })






    //listen for sendLocation event 
    socket.on('sendLocation', (coordinates,callback) => {
        user = chatUsers.getUser(socket.id)
        io.to(user.room).emit('locationMessage', messages.generateLocationMessage({text:`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lat}`,username:user.username}));
        callback();
    })




    //listen for disconnect event
    socket.on('disconnect',()=>{
      user= chatUsers.removeUser(socket.id)
      if (user) {
          io.to(user.room).emit('message', messages.generateMessage({text:`${user.username} has left`,username:'system'} ))

          //send room data to all users in the room when user disconnect 
          io.to(user.room).emit('roomData', {
              roomName: user.room,
              users: chatUsers.getUsersInRoom(user.room)
          })
          
      }
    });
});


app.get('/',(req,res)=>{

    res.render('index')
})


module.exports = server;