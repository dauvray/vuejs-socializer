<template>
    <div id="feed">
        <div class="card">
            <div class="card-body">
                <post-modal
                    :item="item"
                    :type="type"
                    @publish-post="onPublishPost"
                ></post-modal>
                <div class="feed-wrapper">
                    <post-card v-for="(post, idx) in posts.data"
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
                        :postreporturl="postreporturl"
                        :postcommenturl="postcommenturl"
                        @submitComment="onSubmitComment"
                        @comment-deleted="onCommentDeleted"
                        @post-deleted="onPostDeleted"
                        @post-shared="onPostShared"
                    ></post-card>
                    <post-pagination
                        :items="posts"
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
        OffCanvas: () => import('vuejs-estarter/components/widgets/Offcanvas')
    },
    props: {
        item: {
            type: Object,
            required: true
        },
        feedId: {
            type: [Number, String],
            required: true
        },
        type: { // to define post request
            type: String,
            required: false,
            default: 'feed'
        },
        canbecommented: {
            type: Boolean,
            required: false,
            default: true
        },
        canberated: {
            type: Boolean,
            required: false,
            default: false
        },
        canbeliked: {
            type: Boolean,
            required: false,
            default: true
        },
        canbedeleted: {
            type: Boolean,
            required: false,
            default: true
        },
        canbereported: {
            type: Boolean,
            required: false,
            default: true
        },
        postpublishurl: {
            type: String,
            required: false,
            default: '/publish-post',
        },
        postcommenturl: {
            type: String,
            required: false,
            default: '/send-comment'
        },
        postlikeurl: {
            type: String,
            required: false,
            default: '/content-like'
        },
        postdislikeurl: {
            type: String,
            required: false,
            default: '/content-dislike'
        },
        postreporturl: {
            type: String,
            required: false,
            default: '/content-report'
        },
    },
    data() {
      return {
          componentKey: 0
      }
    },
    computed: {
        ...mapGetters({
            posts: 'posts/getPosts',
            logged: 'me/check',
            networkId: 'networks/getNetworkId',
        }),
    },
    watch: {
        feedId: {
            handler:  function (newFeedId, oldFeedId) {
               this.onLoadPosts(`/load-feed/${newFeedId}`)
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions([
            'posts/loadPosts',
            'posts/deletePost',
            'posts/sharePost',

            'posts/publishPost',
            'posts/publishOnFeed',


            'comments/sendComment',
            'comments/deleteComment',
        ]),
        onLoadPosts(url) {
            this['posts/loadPosts'](url)
        },
        onPublishPost(data) {

            // TODO a finir
            // pas clair , voir a uniformiser les publish
            switch(this.type) {
                case 'feed':
                    this['posts/publishPost'](data)
                    .then(() => {
                        this.componentKey++
                    })
                    break
                case 'room':
                    this['posts/publishOnFeed']({
                        ...data,
                        item_id: this.feedId,
                        network_id: this.networkId
                    })
                    .then(() => {
                        this.componentKey++
                    })
                    break
                default:
                    this.$emit('publish-post', data)
                    break
            }

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
