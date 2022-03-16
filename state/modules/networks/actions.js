import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'

export default {
    setNetwork({commit}, network) {
        commit('setNetwork', network)
    },
    setNetworks({commit}, networks) {
        commit('setNetworks', networks)
    },
    followNetwork({commit}, networkSlug) {
        RestDataSourcesMixin.methods.requestApi(`/follow-network/${networkSlug}`)
        .then( networks => {
            commit('me/composeMe', {networks}, { root: true })
        })
    },
    unfollowNetwork({commit}, networkSlug) {
        new Promise((resolve, reject) => {
            RestDataSourcesMixin.methods.requestApi(`/unfollow-network/${networkSlug}`)
            .then(networks => {
                commit('me/composeMe', {networks}, {root: true})
                resolve()
            })
        })
    },
    getWall({commit}, networkSlug) {
        RestDataSourcesMixin.methods.requestApi(`/get-network-wall/${networkSlug}`)
            .then( posts => {
                commit('posts/setPostList', posts, { root: true })
            })
    },
    sendAccessRequest({}, networkId) {
        new Promise((resolve, reject) => {
            RestDataSourcesMixin.methods.requestApi(
                '/send-network-access-request',
                'post',
                {network_id: networkId},
                {
                    err: 'Impossible d\'envoyer la demande',
                    msg: 'Demande envoyée'
                }
            ).then( resp => {
                if(resp == 'success') {
                    resolve()
                }
            })
        })
    },
    acceptAccessRequest({}, payload) {
        new Promise((resolve, reject) => {
            RestDataSourcesMixin.methods.requestApi(
                '/accept-network-access-request',
                'post',
                payload,
                {
                    err: 'Impossible d\'accepter la demande',
                    msg: 'Demande acceptée'
                }
            ).then(resp => {
                if(resp = 'success') {
                    resolve(resp)
                } else {
                    reject()
                }
            })
        })
    },
    refuseAccessRequest({}, payload) {
        RestDataSourcesMixin.methods.requestApi(
            '/refuse-network-access-request',
            'post',
            payload,
            {
                err: 'Impossible de refuser la demande',
                msg: 'Demande refusée'
            }
        )
    }
}
