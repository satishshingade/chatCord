const chatForm = document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const socket = io();
const roomName = document.getElementById('room-name');
const userList=document.getElementById('users');



// Get username and room from URL

const { username, room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
console.log(username,room);


// Join chat room 
socket.emit('joinRoom',{username,room});

// get room  && users 
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});

//message form server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

});

// message submit 

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //get message text 
    const msg=e.target.elements.msg.value;


    // emit the message to the server
    socket.emit('chatMessage',msg);

    // clear the input 
    e.target.elements.msg.value='';
    e.target.elements.msg.focus;
});



// Output message to DOM

function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`
    <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// add room name to dom
function outputRoomName(room){
    roomName.innerText=room;
}

// add users to dom 
function outputUsers(users){
    userList.innerHTML=`
     ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}