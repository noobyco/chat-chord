const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages")
const {join, getCurrentUser, userLeave, getRoomUsers} = require("./utils/Users");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// run when client connect

io.on("connection", socket =>{
    
    console.log("new connection");

    //
    socket.on("joinRoom", ({username, room}) =>{

        const user = join(socket.id, username, room);

        socket.join(user.room);
        
        // Welcome User
        socket.emit("message", formatMessage("ChatBot", "Welcome to ChatChord!"));
        // Broadcast when user connects
        socket.broadcast.to(user.room).emit("message", formatMessage("ChatBot", `${user.username} has joined the chat` ));

        // send users and room info
        io.to(user.room).emit("roomUsers", {
            room : user.room,
            users : getRoomUsers(user.room)
        })
    })
    
    //listen chat Message
    socket.on("chatMessage", (msg)=>{
        const user = getCurrentUser(socket.id);

        //broadcast chatMessage to everybody...
        io.to(user.room).emit("message",formatMessage(user.username, msg));
    });
    
    // Runs when user disconnect;
    socket.on("disconnect", ()=>{
        const user = userLeave(socket.id);
        if (user){

            io.to(user.room).emit("message", formatMessage("ChatBot", `${user.username} just left the chat`));
            
            // send users and room info
            io.to(user.room).emit("roomUsers", {
                room : user.room,
                users : getRoomUsers(user.room)
            })
            
        }
    });

});

// SET static folder
app.use(express.static(path.join(__dirname, "public")))

// setting the port 
const PORT = 3000 || process.env.PORT;


// starting the server
server.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`);
});
