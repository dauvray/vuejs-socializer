<template>
    <div class="card mt-3 post-wrapper">
        <div class="card-body post">
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
            <comment-content
                :item="post"
            ></comment-content>
            <tool-bar
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
            <comment-form
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
                v-if="post.comments.data.length"
                class="comment-list-wrapper"
                :commentable="post"
                :comments="post.comments.data"
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
        </div>
    </div>
</template>

<script>
    export default {
    name: "PostCard",
    inject: ["eventBus"],
    components: {
        AuthorWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Author'),
        DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
        CommentContent: () => import('vuejs-eblogger/components/widgets/Comment/partials/CommentContent'),
        CommentForm: () => import('vuejs-eblogger/components/widgets/Comment/CommentForm'),
        ToolBar: () => import('vuejs-eblogger/components/widgets/Comment/widgets/ToolBar'),
        PostTarget: () => import('vuejs-socializer/components/widgets/post/PostTarget'),
        CommentList: () => import('vuejs-eblogger/components/widgets/Comment/CommentList'),
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
        }
    },
    created() {
        this.eventBus.$on("close-comment-form", this.handleCloseReactFrom)
    },
    methods: {
        toggleComments() {
            this.isCommentsVisble = !this.isCommentsVisble
        },
        onSubmitComment(data) {
            data.parent_id = this.post.id == data.parent_id ? 0 : data.parent_id
            this.$emit('submitComment', {...data, postId: this.post.id})
            this.formvisible = false
        },
        onShowForm() {
            this.formvisible = !this.formvisible
        },
        handleCloseReactFrom(obj) {
            if(this.post.id != obj.id && this.post.type != obj.type) {
                this.formvisible = false
            }
            else {
                this.onShowForm()
            }
        },
        onCommentDeleted(data) {
            this.$emit('comment-deleted', {...data, postId: this.post.id})
        },
        onPostDeleted(data) {
            this.$emit('post-deleted', data)
        }
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
