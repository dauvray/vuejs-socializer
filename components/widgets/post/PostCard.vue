<template>
    <div class="card mt-3 post-wrapper bg-secondary">
        <div v-if="isShared" class="d-flex">
            <author-widget
                :author="post.sharer"
                size="small"
                :profileurl="profileurl"
            ></author-widget> à partagé cette publication
        </div>
        <div class="card-header align-items-start">
            <author-widget
                :author="post.author"
                size="small"
                :profileurl="profileurl"
            ></author-widget>
            <date-helper
                :date="post.created_at"
                :format="'since'"
            ></date-helper>
            <post-target
                class="post-target"
                :target="post.target"
            ></post-target>
        </div>
        <div class="card-body post">
            <comment-body
                :item="post"
            ></comment-body>
        </div>
        <div class="card-footer">
            <div class="d-flex">
                <tool-bar
                    class="mt-3 flex-grow-1"
                    :comment="post"
                    :logged="logged"
                    :formvisible="formvisible"
                    :canbeliked="canbeliked"
                    :canbereported="canbereported"
                    :canbedeleted="canbedeleted"
                    :postlikeurl="postlikeurl"
                    :postdislikeurl="postdislikeurl"
                    :postreporturl="postreporturl"
                    @item-deleted="onPostDeleted"
                ></tool-bar>
                <share-button
                    v-if="canSharePost"
                    @share-item="onSharePost"
                ></share-button>
                <counter-widget
                    v-if="post.comments_count"
                    :nbcomments="post.comments_count"
                    @load-comments="onLoadComments"
                ></counter-widget>
            </div>
            <comment-form
                class="mt-3"
                v-if="formvisible"
                :commentable="post"
                :canRate="false"
                :canberated="canberated"
                :canbeliked="canbeliked"
                :parentid="post.id"
                :logged="logged"
                @submitComment="onSubmitComment"
            ></comment-form>
            <comment-list
                v-if="itemComments"
                class="comment-list-wrapper"
                :commentable="post"
                :comments="itemComments.data"
                :logged="logged"
                :canberated="canberated"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :canbedeleted="canbedeleted"
                :postdislikeurl="postdislikeurl"
                :postlikeurl="postlikeurl"
                :postreporturl="postreporturl"
                :profileurl="profileurl"
                @submitComment="onSubmitComment"
                @item-deleted="onCommentDeleted"
            ></comment-list>
            <comments-pagination
                :items="itemComments"
                @loadPage="onLoadComments"
            ></comments-pagination>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
    name: "PostCard",
    inject: ["eventBus"],
    components: {
        AuthorWidget: () => import('vuejs-estarter/components/widgets/Author'),
        DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
        CommentBody: () => import('vuejs-eblogger/components/widgets/Comment/partials/CommentBody'),
        CommentForm: () => import('vuejs-eblogger/components/widgets/Comment/CommentForm'),
        ToolBar: () => import('vuejs-eblogger/components/widgets/Comment/widgets/ToolBar'),
        PostTarget: () => import('vuejs-socializer/components/widgets/post/PostTarget'),
        CommentList: () => import('vuejs-eblogger/components/widgets/Comment/CommentList'),
        ShareButton: () => import('vuejs-socializer/components/widgets/post/ShareButton'),
        CounterWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Counter'),
        CommentsPagination: () => import('vuejs-estarter/components/widgets/Pagination'),
    },
    props: {
        post: {
            type: Object,
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
        canbereported: {
            type: Boolean,
            default: false
        },
        canbedeleted: {
            type: Boolean,
            default: false
        },
        postlikeurl: String,
        postdislikeurl: String,
        postreporturl: String,
        postcommenturl: String,
        profileurl: String,
    },
    data() {
        return {
            formvisible: false,
            commentsLoaded: false,
        }
    },
    computed: {
        ...mapGetters({
            me: 'me/getMe',
            comments: 'comments/getComments',
        }),
        canSharePost: function() {
            return this.post.target == 1 && this.me.id != this.post.author.id
        },
        isShared: function() {
            return this.post.sharer
        },
        itemComments: function() {
            return this.comments(this.post.key)
        }
    },
    created() {
        this.eventBus.$on("close-comment-form", this.handleCloseReactFrom)
        this['comments/init'](this.post)
    },
    methods: {
        ...mapActions([
            'comments/init',
            'comments/loadComments',
        ]),
        toggleComments() {
            this.isCommentsVisble = !this.isCommentsVisble
        },
        onSubmitComment(data) {
            data.parent_id = this.post.id == data.parent_id ? 0 : data.parent_id
            this.$emit('submitComment', {
                comment: {...data, postId: this.post.id},
                commentable: this.post
                })
            this.formvisible = false
        },
        onShowForm() {
            this.eventBus.$emit("close-comment-form", this.post);
            this.formvisible = !this.formvisible
        },
        handleCloseReactFrom(obj) {
            if(this.post.id != obj.id || this.post.type != obj.type) {
                this.formvisible = false
            }
            else {
                this.formvisible = !this.formvisible
            }
        },
        onCommentDeleted(data) {
            this.$emit('comment-deleted', {
                comment: {...data, postId: this.post.id},
                commentable: this.post
            })
        },
        onPostDeleted(data) {
            this.$emit('post-deleted', data)
        },
        onSharePost() {
            this.$emit('post-shared', {
                post_id: this.post.id,
                user_id: this.me.id
            })
        },
        onLoadComments(url = '/get-comments') {
            this['comments/loadComments']({
                commentable: this.post,
                url: url
            }).then(() => {
                this.commentsLoaded = true
            })
        },
    }
}
</script>

<style lang="scss" scoped>
    .post-wrapper {
        .post {
            position: relative;
            .post-target {
                position: absolute;
                top: 15px;
                right: 15px;
            }
        }
    }
</style>
