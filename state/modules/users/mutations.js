export default {
    setUser(state, user) {
        state.user = {...user}
    },
    setPaginatedUsers(state, paginatedUSers) {
        state.paginatedUsers = paginatedUSers
    },
    addFriend(state, user_id) {
        if(state.paginatedUsers.data.length) {
            state.paginatedUsers.data.forEach(item => {
                if(item.id == user_id) {
                    item.receivedfriendRequests = true
                }
            })
        } else {
            state.user.receivedfriendRequests = true
        }
    },
    cancelInvitation(state, user_id) {
        if(state.paginatedUsers.data.length) {
            state.paginatedUsers.data.forEach(item => {
                if (item.id == user_id) {
                    item.receivedfriendRequests = false
                }
            })
        } else {
            state.user.receivedfriendRequests = false
        }
    },
    acceptInvitation(state, user_id) {
        if(state.paginatedUsers.data.length) {
            state.paginatedUsers.data.forEach(item => {
                if (item.id == user_id) {
                    item.sendedfriendRequests = false
                    item.receivedfriendRequests = false
                    item.friends = true
                }
            })
        } else {
            state.user.sendedfriendRequests = false
            state.user.receivedfriendRequests = false
            state.user.friends = true
        }
    },
    denyInvitation(state, user_id) {
        if(state.paginatedUsers.data.length) {
            state.paginatedUsers.data.forEach((item, idx) => {
                if (item.id == user_id) {
                    state.paginatedUsers.data.splice(idx, 1)
                }
            })
        } else {
            state.user = null
        }
    },
}
