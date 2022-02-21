

// //Exposed as the io namespace in the standalone build, or the result of calling require("socket.io-client").
const socket = io(); //connecting our js file with our server.

const form = document.getElementById('send-container-form');

const messageInput = document.getElementById('inp_msg');

const message_box = document.querySelector(".message-box"); // puttinf user message in message box

const name = document.currentScript.getAttribute('name'); // importing login name from chat.hbs

console.log(name);

var rec = new Audio('rec.WAV');
var sent = new Audio('sent.WAV');
var leav = new Audio('left.mp3');

const append = (message, position) => {

    const messageEle = document.createElement('div');
    messageEle.innerHTML = message;
    messageEle.classList.add('message');
    messageEle.classList.add(position);
    message_box.append(messageEle);

    if (position == 'left') {
        rec.play();
    }
    if (position == 'right') {
        sent.play();
    }

}

// when some one send the message that is from==submit.
form.addEventListener('submit', (e) => {

    // here event listener takes event as submit and a function "e" where parameter of event depend upon the form type 
    // here paremeter of function "e" is message


    //prevent reloading                                 
    e.preventDefault();

    const message = messageInput.value;
    append(`You:${message}`, 'right');
    socket.emit('send', message);

    // to make message box empty again
    messageInput.value = '';

})

// taking name input in prompt window;

// after taking the name we need to tell all users that a new user has joined

// so we start an event 'new-user-joined' catch by our server that tell us a new user has joined
socket.emit('new-user-joined', name);

//when a user join then run a function 
// it call the function "data" when the event'user-joined' happen
socket.on('usre-joined', name => {
    append(`${name} Join the chat`, "right");
});

// recieve event is coming from the server site. that has two data message and name
socket.on('recieve', data => {
    append(`${data.name}:${data.message}`, "left");
});


// listining disconnect event

socket.on('left', name => {
    append(`${name} leave the Chat`, 'left');
    leav.play();
})




