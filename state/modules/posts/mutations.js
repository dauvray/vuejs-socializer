import { _updateCommentList, _deleteCommentList, paginatedTemplate } from 'vuejs-eblogger/components/helpers/utils';
import Vue from 'vue'

export default {
    setPostList(state, posts) {
        state.paginatedPosts = {...posts}
    },
    insertComment(state, data) {
        state.paginatedPosts.data.forEach((item, idx) => {
            if(item.id == data.postId) {
                if(data.newComment.parent_id == 0) {
                    state.paginatedPosts.data[idx].comments.data.splice(0, 0, data.newComment)
                } else {
                    _updateCommentList(data.newComment, state.paginatedPosts.data[idx].comments.data)
                }
            }
        })
    },
    deletePost(state, data) {
        state.paginatedPosts.data.forEach((item, idx) => {
            if(item.id == data.id) {
                state.paginatedPosts.data.splice(idx,1)
            }
        })
    },
}
