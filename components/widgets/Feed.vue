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
        PostForm: () => import('vuejs-socializer/components/widgets/post/PostForm')
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        feed: {
            type: Object,
            required: true
        }
    },
    methods: {
        onSaveModalChanges() {

        }
    }
}
</script>

<style scoped>

</style>
