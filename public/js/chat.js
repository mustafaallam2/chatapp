
//init elements
const $messageForm = document.querySelector('#message-form');
const $sendLocationBtn = document.querySelector('#sendLocation');
const $messageField = document.querySelector('#messageField');
const $sendBtn = document.querySelector('#sendBtn');
const $messages = document.querySelector('#messages');

//templates  
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix : true})

//functions

const autoScroll = ()=>{
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}



//listen for socket events 

const socket= io() ;
//listen for message event
socket.on('message', (message)=>{

    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A'),
        username:message.username

    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
})



//listen for locationMessage event
socket.on('locationMessage', (LocationMessage)=>{

    const html = Mustache.render(locationMessageTemplate, {
        locationMessage: LocationMessage.url,
        createdAt: moment(LocationMessage.createdAt).format('hh:mm A'),
        username: LocationMessage.username
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
})

//listen for locationMessage event
socket.on('roomData', (roomData) => {
    const html = Mustache.render(sidebarTemplate,{
        room: roomData.roomName,
        users:roomData.users
    })
    document.querySelector('#sidebar').innerHTML=html ;

})






$messageForm.addEventListener('submit', (form) => {
    form.preventDefault();

    $sendLocationBtn.setAttribute('disabled','true');
    $sendBtn.setAttribute('disabled', 'true');

    let message = form.target.message.value;

    socket.emit('sendMessage',message,(error)=>{

        $sendLocationBtn.removeAttribute('disabled');
        $sendBtn.removeAttribute('disabled');

        if (error) {
            return alert(error)
        }
        console.log('message delivered');

        messageField.value='';
        messageField.focus();
    });
})

$sendLocationBtn.addEventListener('click', () => {

        $sendLocationBtn.setAttribute('disabled', 'true');
        $sendBtn.setAttribute('disabled', 'true');

   // form.preventDefault();
    if(!navigator.geolocation){
        return alert('geo location is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        coordinates = {
            lat: position.coords.latitude ,
            lon: position.coords.longitude,

        };
        socket.emit('sendLocation',coordinates,(error)=>{
        $sendLocationBtn.removeAttribute('disabled');
        $sendBtn.removeAttribute('disabled');
            if (error) {
                return console.log(error);
            }
            console.log('location shared');
        });
    })
})

socket.emit('join',{username,room},(error)=>{
    if (error) {
        alert(error)
        location.href="/"
    }
});


// socket.on('countUpdated',(count)=>{
//     console.log(count);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log("button clicked");
//     socket.emit('increment');
//})