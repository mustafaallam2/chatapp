var users = [];

const addUser = ({id,username,room})=>{

    if (!username || !room) {
        return {
            error : 'username and room are required'
        }
    }

    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //check for existing user 
    const existingUser= users.find((user)=>{
        return user.room == room && user.username === username ;
    });


    //validate username
    if (existingUser) {
        return {
            error: 'username is taken'
        }
        
    }

    //store user 
    const user = {id,username,room}
    users.push(user);
    return user ; 
}


const removeUser=(id)=>{
    const userIndex= users.findIndex((user)=>{
        return user.id== id ;
    })
    if (userIndex != -1) {
        return users.splice(userIndex,1)[0];
    }
}

const getUser=  (id)=>{
    
   user= users.find((user)=>user.id==id)
    if (!user) {
        return {
            error: 'user not found'
        }
    }
    return user ; 
   
}

const getUsersInRoom=  (room)=>{
    room=room.trim().toLowerCase()
   users= users.filter((user)=>user.room==room)
    if (!users) {
        return {
            error: 'users in this room'
        }
    }
    return users ; 
   
}
module.exports={
    addUser,
    getUser,
    getUsersInRoom,
    removeUser
}

// addUser({
//     id:'21',
//     username:'mustafaallam',
//     room : 'room1'
// })
// addUser({
//     id: '22',
//     username: 'mustafaallam2',
//     room: 'room2'
// })
// //console.log(users);
// console.log(getUsersInRoom('room1'));
// //console.log(removeUser(22));

// //console.log(users);