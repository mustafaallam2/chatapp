

generateMessage=(message)=>{
return {
    text : message.text ,
    createdAt : new Date().getTime(),
    username : message.username
}

}

generateLocationMessage=(LocationMessage)=>{
return {
    url: LocationMessage,
    createdAt : new Date().getTime(),
    username: LocationMessage.username
}

}


module.exports = {
    generateMessage,
    generateLocationMessage
}