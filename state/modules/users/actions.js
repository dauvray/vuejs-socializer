import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'

export default {
    setUser({commit}, user) {
        commit('setUser', user)
    },
    async loadNetworkUsers({commit}) {
        let response = await RestDataSourcesMixin.methods.requestApi('/get-network-users')
        commit('setPaginatedUsers', response)
    },
    async loadFriendUsers({commit}) {
        let response = await RestDataSourcesMixin.methods.requestApi('/get-friend-users')
        commit('setPaginatedUsers', response)
    },
    updateCover({commit}, formData) {
        RestDataSourcesMixin.methods.requestApi('/update-cover', 'post', formData)
        .then( user => {
            commit('setUser', user)
        })
    },
    async addFriend({commit}, user_id) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            `/add-friend/${user_id}`,
            'get',
            null,
            {
                err: 'Invitation impossible',
                msg: 'Invitation envoyée'
            })

        commit('addFriend', user_id)
    },
    async removeFriend({commit}, user_id) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            `/remove-friend/${user_id}`,
            'get',
            null,
            {
                err: 'Bloquage impossible',
                msg: 'Relation bloquée'
            })
        commit('denyInvitation', user_id)
    },
    async cancelInvitation({commit}, user_id) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            `/cancel-friend-request/${user_id}`,
            'get',
            null,
            {
                err: 'Anulation impossible',
                msg: 'Invitation annulée'
            })
        commit('cancelInvitation', user_id)
    },
    async acceptInvitation({commit}, user_id) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            `/accept-friend-request/${user_id}`,
            'get',
            null,
            {
                err: 'Acceptation impossible',
                msg: 'Invitation acceptée'
            })
        commit('acceptInvitation', user_id)
    },
    async denyInvitation({commit}, user_id) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            `/deny-friend-request/${user_id}`,
            'get',
            null,
            {
                err: 'Refus impossible',
                msg: 'Invitation refusée'
            })
        commit('denyInvitation', user_id)
    },
}
