<template>
    <div id="feed">
        <div class="card">
            <div class="card-body">
                <post-modal
                    :user="user"
                    :type="type"
                ></post-modal>
                <div class="feed-wrapper">
                    <post-card v-for="(post, idx) in items"
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
                    ></post-card>
                    <post-pagination
                        :items="items"
                        :links="postLinks"
                        :meta="postMeta"
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
            items: 'posts/getDataPosts',
            postLinks: 'posts/getLinksPosts',
            postMeta: 'posts/getMetaPosts',
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
            'posts/sendComment',
            'posts/deleteComment',
            'posts/deletePost'
        ]),
        setPostList(feed) {
            this['posts/setPostList'](feed)
        },
        onSubmitComment(data) {
            this['posts/sendComment'](data)
        },
        onLoadPosts(url) {
            this['posts/loadPosts'](url)
        },
        onCommentDeleted(data) {
            this['posts/deleteComment'](data)
        },
        onPostDeleted(data) {
            this['posts/deletePost'](data)
        }
    }
}
</script>

<style scoped>

</style>
