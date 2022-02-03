<template>
    <div>
        <button
            type="button"
            class="btn btn-light btn-sm"
            @click="onShowModal">
            <i class="lar la-paper-plane"></i> {{getPublishBtnLabel}}
        </button>
        <modal-widget
            v-if="showModal"
            class="d-flex justify-content-end"
            :target="targetModal"
            :trigger="showModal"
            :showBtn="false"
            @hide="onHideModal">
            <template #header>
                Créer un post
            </template>
            <template #body>
                <author-widget
                    :author="user"
                    size="small"
                ></author-widget>
                <post-form
                    :type="type"
                    @change-post-content="onChangePostContent"
                    @change-post-target="onChangePostTarget"
                ></post-form>
            </template>
            <template #footer>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-primary" @click="onPublishPost">Publier</button>
            </template>
        </modal-widget>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "PostModal",
        components: {
            PostForm: () => import('vuejs-socializer/components/widgets/post/PostForm'),
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            AuthorWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Author'),
        },
        props: {
            user: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                required: true,
            }
        },
        data() {
          return {
              targetModal: 'publishPost',
              postContent: null,
              postTarget: null,
              showModal: false,
          }
        },
        computed: {
            getPublishBtnLabel: function() {
                return this.type == 'feed' ? 'Publier' : 'Publier sur le mur'
            }
        },
        methods: {
            ...mapActions([
                'posts/publishPost',
            ]),
            onChangePostContent(value) {
                this.postContent = value
            },
            onChangePostTarget(value) {
                this.postTarget = value
            },
            onPublishPost() {
                this['posts/publishPost']({
                    target: this.postTarget,
                    postContent: this.postContent,
                    user_id: this.user.id,
                    type: this.type
                }).then(() => {
                    this.resetAll()
                })
            },
            onShowModal() {
                this.showModal = true
            },
            onHideModal() {
                this.showModal = false
            },
            resetAll() {
                const modal = document.getElementById(this.targetModal)
                const bsModal = bootstrap.Modal.getOrCreateInstance(modal)
                bsModal.hide()
                this.postContent = null
                this.postTarget = null
            }
        }
    }
</script>

<style scoped>

</style>
