<template>
        <div id="feed">
            <div class="card">
                <div class="card-body">
                    <modal-widget target="publishPost" class="d-flex justify-content-end"
                                  btnclass="btn btn-light btn-lg btn-block">
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
                            <post-form ref="postForm"></post-form>
                        </template>
                        <template #footer>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                            <button type="button" class="btn btn-primary" @click="onPublishPost">Publier</button>
                        </template>
                    </modal-widget>
                    <div class="feed-wrapper">
                        <post-card v-for="(post, idx) in items"
                           :key="componentKey + idx"
                           :post="post"
                           :logged="logged"
                           :canberated="canberated"
                           :canbeliked="canbeliked"
                           :canbereported="canbereported"
                           :canbecommented="canbecommented"
                           :postdislikeurl="postdislikeurl"
                           :postlikeurl="postlikeurl"
                           :profileurl="profileurl"
                           :postreporturl="postreporturl"
                           :postcommenturl="postcommenturl"
                           @submitComment="onSubmitComment"
                        ></post-card>
                        <blog-pagination :items="feed.data"
                             :links="feed.links"
                             :meta="feed.meta"
                             @loadPage="onLoadPosts"
                        ></blog-pagination>
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
        PostCard: () => import('vuejs-socializer/components/widgets/post/PostCard'),
        BlogPagination: () => import('vuejs-estarter/components/widgets/Pagination'),
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
        postlikeurl: String,
        postdislikeurl: String,
        postreporturl: String,
        postcommenturl: String,
        postpublishurl: String,
        profileurl: String,
    },
    data() {
      return {
          posts: this.feed.data,
          componentKey: 0
      }
    },
    computed: {
        items: function() {
            return this.posts
        }
    },
    watch: {
        feed: function (newValue, oldValue) {
            this.posts = newValue.data
        }
    },
    methods: {
        onPublishPost() {
           let formData = this.$refs.postForm.getPostFormContent()
            $('#publishPost').modal('hide')

            // is in vuejs-estarter framework ?
            if(typeof this.$estarterSettings === 'undefined') {
                axios.post(this.postpublishurl, formData)
                .then((response) => {
                    this.componentKey += 100
                    this.posts = response.data.data
                })
                .catch((error) => {
                    alert(error);
                });
            } else {
               this.$emit('publishPost', formData)
            }
        },
        onSubmitComment(data) {

        },
        onLoadPosts() {

        }
    }
}
</script>

<style scoped>

</style>
