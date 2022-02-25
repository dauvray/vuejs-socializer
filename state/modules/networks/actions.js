import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'

export default {
    setNetwork({commit}, network) {
        commit('setNetwork', network)
    },
    followNetwork({commit}, networkSlug) {
        RestDataSourcesMixin.methods.requestApi(`/follow-network/${networkSlug}`)
        .then( networks => {
            commit('me/composeMe', {networks}, { root: true })
        })
    },
    unfollowNetwork({commit}, networkSlug) {
        RestDataSourcesMixin.methods.requestApi(`/unfollow-network/${networkSlug}`)
        .then( networks => {
            commit('me/composeMe', {networks}, { root: true })
        })
    },
    getWall({commit}, networkSlug) {
        RestDataSourcesMixin.methods.requestApi(`/get-network-wall/${networkSlug}`)
            .then( posts => {
                commit('posts/setPostList', posts, { root: true })
            })
    }
}
