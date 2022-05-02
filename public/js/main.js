// selecting tags

// const { Server } = require("socket.io");s

const form = document.getElementById("chat-form");
const chatMsg = document.querySelector(".chat-messages");

// get username and room 

const { username, room} = Qs.parse(window.location.search, {
    ignoreQueryPrefix : true
})

console.log(username, room);

// emmiting usernameu and room to Server

// socket crap

const socket = io()
socket.emit("joinRoom", {username, room});


socket.on("roomUsers", ({room, users}) => {
    outputRoomNames(room);
    outputUsers(users);
})

socket.on("message", msg =>{

    console.log(msg);
    outputMessage(msg);
    // scroll
    chatMsg.scrollTop = chatMsg.scrolulHeight;

    //clear chat input
    
});

// Eventlistner

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

    socket.emit("chatMessage", msg);
})    


// functions

function outputMessage(msg){
    
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
    ${msg.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
    // msgDiv.appendChild(div)
}    


function outputRoomNames(room){
    document.querySelector("#room-name").innerHTML = `${room}`
}

function outputUsers(users){
    document.querySelector("#users").innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    
    `;
}
