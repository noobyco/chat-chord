const state = []

// join user to chat

function join(id, username, room){
    const user = {id, username, room};
    state.push(user);
    return user;
}

function getCurrentUser(id){
    return state.find(user => user.id == id);
}


//user leave chat

function userLeave(id){
    const index = state.findIndex(index => index.id == id);
    
    if(index !== -1){
        return state.splice(index, 1)[0];
    }

}

function getRoomUsers(room){
    return state.filter(users => users.room == room);
}




module.exports = {
    join,
    userLeave,
    getRoomUsers,
    getCurrentUser
}