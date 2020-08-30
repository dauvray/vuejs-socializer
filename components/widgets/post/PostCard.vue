<template>
    <div class="card mt-3 post-wrapper">
        <div class="card-body post">
            <div class="author">
                <gravatar-widget :user="post.author" size="small"></gravatar-widget>
                {{post.author.name}}
                <date-helper :date="post.created_at" class="date pr-2" :format="'since'"/>
            </div>
            <p class="card-text">
                {{post.content}}
            </p>
            <comments-widget :commentable="post"
                :logged="logged"
                :canbecommented="canbecommented"
                :canberated="canberated"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :postcommenturl="postcommenturl"
                :postdislikeurl="postdislikeurl"
                :postlikeurl="postlikeurl"
                :postreporturl="postreporturl"
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
        },
        showForm() {
            this.eventBus.$emit("close-comment-rect-btn", this);
            this.formVisible = !this.formVisible
        },
    }
}
</script>

<style scoped>

</style>
