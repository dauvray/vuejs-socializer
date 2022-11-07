export default {
    getNetwork(state) {
        return state.network
    },
    getNetworkId(state) {
        return state.network.id
    },
    getNetworks(state) {
        return state.paginatedNetworks
    },
    getRoomsNetwork(state) {
        return state.network.rooms
    },
    getRoom(state) {
        return state.room
    },


    // todo : voir a quoi ça sert ?!
    getMyNetworks(state, getters, rootState, rootGetters) {
        return rootGetters['me/getMe'].networks || []
    }
}
