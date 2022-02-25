export default {
    getUsers(state) {
        return state.paginatedUsers.data
    },
    getTotalUsers(state) {
        return state.paginatedUsers.total
    },
    getUser(state) {
        return state.user
    }
}
