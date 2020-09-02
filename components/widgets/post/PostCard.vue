<template>
    <div class="card mt-3 post-wrapper">
        <div class="card-body post">
            <div class="author">
                <gravatar-widget :user="post.author" size="small"></gravatar-widget>
                {{post.author.name}}
                <date-helper :date="post.created_at" class="date pr-2" :format="'since'" />
            </div>
            <p class="card-text">
                {{post.content}}
            </p>
            <tool-bar
                :comment="post"
                :logged="logged"
                :formvisible="formvisible"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :postlikeurl="postlikeurl"
                :postdislikeurl="postdislikeurl"
                :postreporturl="postreporturl"
                @response-comment="onShowForm"
            ></tool-bar>
            <comments-widget
                :commentable="post"
                :logged="logged"
                :formvisible="formvisible"
                :showInfos="false"
                :canbecommented="canbecommented"
                :canberated="canberated"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :postcommenturl="postcommenturl"
                :postdislikeurl="postdislikeurl"
                :postlikeurl="postlikeurl"
                :postreporturl="postreporturl"
                @submitComment="onSubmitComment"
            ></comments-widget>
        </div>
    </div>
</template>

<script>
    export default {
    name: "PostCard",
    inject: ["eventBus"],
    components: {
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
        CommentsWidget: () => import('vuejs-eblogger/components/widgets/Comment/Comments'),
        ToolBar: () => import('vuejs-eblogger/components/widgets/Comment/widgets/ToolBar'),
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
        postcommenturl: String
    },
    data() {
        return {
            formvisible: false,
        }
    },
    methods: {
        toggleComments() {
            this.isCommentsVisble = !this.isCommentsVisble
        },
        onSubmitComment(data) {
            this.$emit('submitComment', data)
            this.formvisible = false
        },
        onShowForm() {
            this.formvisible = !this.formvisible
        },
    }
}
</script>

<style scoped>

</style>
