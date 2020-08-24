<template>
    <div class="card">
        <div class="card-body">
            <div class="author">
                <gravatar-widget :user="post.user" size="small"></gravatar-widget>
                {{post.user.name}}
                <date-helper :date="post.created_at" class="date pr-2" :format="'since'"/>
            </div>
            <p>
                {{post.content}}
            </p>
            <comment-form :commentable="post"
                          :logged="logged"
                          :canberated="canberated"
                          @submitComment=""
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
export default {
    name: "PostCard",
    components: {
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
        CommentList: () => import('vuejs-eblogger/components/widgets/Comment/CommentList'),
        CommentForm: () => import('vuejs-eblogger/components/widgets/Comment/CommentForm'),
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
}
</script>

<style scoped>

</style>
