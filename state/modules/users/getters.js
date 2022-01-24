export default {
    getUsers(state) {
        return state.paginatedUsers.data
    },
    getUser(state) {
        return state.user
    }
}
