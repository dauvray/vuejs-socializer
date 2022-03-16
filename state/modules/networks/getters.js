export default {
    getNetwork(state) {
        return state.network
    },
    getNetworks(state) {
        return state.paginatedNetworks.data
    },
    getMyNetworks(state, getters, rootState, rootGetters) {
        return rootGetters['me/getMe'].networks || []
    }
}
