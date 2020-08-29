<template>
        <div id="feed">
            <div class="card">
                <div class="card-body">
                    <modal-widget target="changecover" class="d-flex justify-content-end"
                                  btnclass="btn btn-light btn-lg btn-block"
                                  @saveModalChanges="onSaveModalChanges">
                        <template #button>
                            <i class="fas fa-edit"></i> Commencer un post
                        </template>
                        <template #header>
                            Créer un post
                        </template>
                        <template #body>

                            <div class="author">
                                <gravatar-widget :user="user" size="small"></gravatar-widget>
                                {{user.name}}
                            </div>

                            <post-form></post-form>

                        </template>
                    </modal-widget>
                    <div class="feed-wrapper">
                        <post-card v-for="(post, idx) in feed.data" :key="idx"
                                   :post="post"
                                   :logged="logged"
                                   :canberated="canberated"
                                   :canbeliked="canbeliked"
                                   :canbereported="canbereported"
                                   :commentable="commentable"
                                   :postdislikeurl="postdislikeurl"
                                   :postlikeurl="postlikeurl"
                                   :postreporturl="postreporturl"
                                   @submitComment="onSubmitComment"
                        ></post-card>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    name: "Feed",
    components: {
        ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        PostForm: () => import('vuejs-socializer/components/widgets/post/PostForm'),
        PostCard: () => import('vuejs-socializer/components/widgets/post/PostCard')
    },
    props: {
        user: {
            type: Object,
            required: true
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
        canbereported: {
            type: Boolean,
            default: false
        },
        commentable: Object,
        postlikeurl: String,
        postdislikeurl: String,
        postreporturl: String,
    },
    methods: {
        onSaveModalChanges(formData) {

        },
        onSubmitComment(data) {
            console.log(data)
        }
    }
}
</script>

<style scoped>

</style>
