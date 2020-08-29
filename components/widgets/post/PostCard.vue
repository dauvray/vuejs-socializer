<template>
    <div class="card mt-3 post-wrapper">
        <div class="card-body post">
            <div class="author">
                <gravatar-widget :user="post.user" size="small"></gravatar-widget>
                {{post.user.name}}
                <date-helper :date="post.created_at" class="date pr-2" :format="'since'"/>
            </div>
            <p class="card-text">
                {{post.content}}
            </p>
            <tool-bar
                :comment="post"
                :logged="logged"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :postlikeurl="postlikeurl"
                :postdislikeurl="postdislikeurl"
                :postreporturl="postreporturl"
                @response-comment="showForm"
            ></tool-bar>
            <comment-form v-if="formVisible"
                          :commentable="post"
                          :logged="logged"
                          :canberated="canberated"
                          @submitComment="onSubmitComment"
            ></comment-form>
            <comment-list :comments="[]"
                          :logged="logged"
                          :canberated="canberated"
                          :canbeliked="canbeliked"
                          :canbereported="canbereported"
                          :commentable="post"
                          :postdislikeurl="postdislikeurl"
                          :postlikeurl="postlikeurl"
                          :postreporturl="postreporturl"
                          @submitComment=""
            ></comment-list>
        </div>
    </div>
</template>

<script>
import {EventBus} from "vuejs-eblogger/components/widgets/Comment/Comment";

export default {
    name: "PostCard",
    components: {
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
        CommentList: () => import('vuejs-eblogger/components/widgets/Comment/CommentList'),
        CommentForm: () => import('vuejs-eblogger/components/widgets/Comment/CommentForm'),
        ToolBar: () => import('vuejs-eblogger/components/widgets/Comment/widgets/ToolBar')
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
        postlikeurl: String,
        postdislikeurl: String,
        postreporturl: String,
    },
    data() {
        return {
            formVisible: false,
        }
    },
    methods: {
        toggleComments() {
            this.isCommentsVisble = !this.isCommentsVisble
        },
        onSubmitComment(data) {
            this.$emit('submitComment', data)
        },
        showForm() {
            EventBus.$emit("close-comment-rect-btn", this);
            this.formVisible = !this.formVisible
        },
    }
}
</script>

<style scoped>

</style>
