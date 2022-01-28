import { _updateCommentList, _deleteCommentList } from 'vuejs-eblogger/components/helpers/utils';

export default {
    setPostList(state, posts) {
        state.data = [...posts.data]
        state.links = {...posts.links}
        state.meta = {...posts.meta}
    },
    insertComment(state, data) {
        state.data.forEach((item, idx) => {
            if(item.id == data.postId) {
                if(data.newComment.parent_id == 0) {
                    state.data[idx].comments.data.splice(0, 0, data.newComment)
                } else {
                    _updateCommentList(data.newComment, state.data[idx].comments.data)
                }
            }
        })
    },
    deleteComment(state, data) {
        state.data.forEach((item, idx) => {
            if(item.id == data.postId) {
                _deleteCommentList(data, state.data[idx].comments.data)
            }
        })
    },
    deletePost(state, data) {
        state.data.forEach((item, idx) => {
            if(item.id == data.id) {
                state.data.splice(idx,1)
            }
        })
    }
}
