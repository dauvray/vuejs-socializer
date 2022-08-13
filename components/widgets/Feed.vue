<template>
    <div id="feed">
        <div class="card">
            <div class="card-body">
                <post-modal
                    :item="user"
                    :type="type"
                    @publish-post="onPublishPost"
                ></post-modal>
                <div class="feed-wrapper">
                    <post-card v-for="(post, idx) in items.data"
                        :key="componentKey + idx"
                        :post="post"
                        :logged="logged"
                        :canberated="canberated"
                        :canbeliked="canbeliked"
                        :canbereported="canbereported"
                        :canbecommented="canbecommented"
                        :canbedeleted="canbedeleted"
                        :postdislikeurl="postdislikeurl"
                        :postlikeurl="postlikeurl"
                        :profileurl="profileurl"
                        :postreporturl="postreporturl"
                        :postcommenturl="postcommenturl"
                        @submitComment="onSubmitComment"
                        @comment-deleted="onCommentDeleted"
                        @post-deleted="onPostDeleted"
                        @post-shared="onPostShared"
                    ></post-card>
                    <post-pagination
                        :items="items"
                        @loadPage="onLoadPosts"
                    ></post-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
    name: "Feed",
    inject: ["eventBus"],
    components: {
        PostModal: () => import('vuejs-socializer/components/widgets/post/PostModal'),
        PostCard: () => import('vuejs-socializer/components/widgets/post/PostCard'),
        PostPagination: () => import('vuejs-estarter/components/widgets/Pagination'),
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        type: {
          type: String,
          required: true,
        },
        feed: {
            type: [Array, Object],
            required: true
        },
        logged: {
            type: Boolean,
            default: false
        },
        canbecommented: {
            type: Boolean,
            default: false
        },
        canberated: {
            type: Boolean,
            default: false
        },
        canbeliked: {
            type: Boolean,
            default: false
        },
        canbedeleted: {
            type: Boolean,
            default: false
        },
        canbereported: {
            type: Boolean,
            default: false
        },
        postlikeurl: String,
        postdislikeurl: String,
        postreporturl: String,
        postcommenturl: String,
        postpublishurl: String,
        profileurl: String,
    },
    data() {
      return {
          componentKey: 0
      }
    },
    computed: {
        ...mapGetters({
            items: 'posts/getPosts',
        }),
    },
    watch: {
        feed: function (newValue, oldValue) {
            this.setPostList(newValue)
        },
    },
    created() {
        this.setPostList(this.feed)
    },
    methods: {
        ...mapActions([
            'posts/setPostList',
            'posts/loadPosts',
            'posts/deletePost',
            'posts/sharePost',
            'posts/publishPost',
            'comments/sendComment',
            'comments/deleteComment',
        ]),
        setPostList(feed) {
            this['posts/setPostList'](feed)
        },
        onLoadPosts(url) {
            this['posts/loadPosts'](url)
        },
        onPublishPost(data) {
            this['posts/publishPost'](data)
            .then(() => {
                this.componentKey++
            })
        },
        onPostDeleted(data) {
            this['posts/deletePost'](data)
        },
        onPostShared(data) {
            this['posts/sharePost'](data)
        },
        onCommentDeleted(data) {
            this['comments/deleteComment'](data)
        },
        onSubmitComment(data) {
            this['comments/sendComment'](data)
        },
    }
}
</script>

<style scoped>

</style>
