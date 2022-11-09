import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'
import { paginatedTemplate } from 'vuejs-eblogger/components/helpers/utils'

export default {
    setPostList({commit}, posts){
        commit('setPostList', posts)
    },
    async publishPost({commit}, post) {
        let response = await RestDataSourcesMixin.methods.requestApi(
            '/publish-post',
            'post',
            post,
            {
                err: 'Publication impossible',
                msg: 'Post publié'
                }
            )
        commit('setPostList', response)
    },
    async loadPosts({commit}, url) {
        // reset
        commit('setPostList', {...paginatedTemplate()})
        let response = await RestDataSourcesMixin.methods.requestApi(url)
        commit('setPostList', response)
    },


    sendComment({commit}, data) {
       RestDataSourcesMixin.methods.requestApi(
            '/send-comment',
            'post',
            data,
            {
                err: 'Erreur',
                msg: 'Commentaire posté'
            })
        .then(response => {
            commit('insertComment', {
                newComment: response,
                postId: data.postId
            })
        })
    },
    deletePost({commit}, data) {
        RestDataSourcesMixin.methods.requestApi(
            '/delete-content-type',
            'post',
            data,
            {
                err: 'Suppression impossible',
                msg: 'Contenu supprimé'
            }
        ).then(response => {
            commit('deletePost', data)
        })
    },
    sharePost({}, data) {
        RestDataSourcesMixin.methods.requestApi(
            '/share-post',
            'post',
            data,
            {
                err: 'Partage impossible',
                msg: 'Partage réussi'
            }
        ).then(response => {
          //
        })
    },
}
