export default {
    getNetwork(state) {
        return state.network
    },
    getMyNetworks(state, getters, rootState, rootGetters) {
        return rootGetters['me/getMe'].networks || []
    }
}
