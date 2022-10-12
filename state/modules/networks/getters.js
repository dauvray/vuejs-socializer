export default {
    getNetwork(state) {
        return state.network
    },
    getNetworks(state) {
        return state.paginatedNetworks
    },
    getRoomsNetwork(state) {
        return state.network.rooms
    },


    // todo : voir a quoi ça sert ?!
    getMyNetworks(state, getters, rootState, rootGetters) {
        return rootGetters['me/getMe'].networks || []
    }
}
