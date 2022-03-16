export default {
    setNetwork(state, network) {
        state.network = {...network}
    },
    setNetworks(state, paginatedNetworks) {
        state.paginatedNetworks = paginatedNetworks
    }
}
