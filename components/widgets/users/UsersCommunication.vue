<template>
    <div>
        <div class="btn-group btn-group-sm" role="group" aria-label="Communication">
            <video-button
                v-if="user.is_online"
                :user="user"
                @show-modal="onShowModal"
            ></video-button>
            <button
                v-if="user.is_online"
                type="button"
                class="btn btn-primary"
            ><i class="las la-phone"></i></button>
            <button type="button"
                    class="btn btn-primary"
            ><i class="lar la-envelope"></i></button>
        </div>
    </div>

</template>

<script>
    export default {
        name: "UsersCommunication",
        components: {
          VideoButton: () => import('vuejs-socializer/components/widgets/users/communication/VideoBtn')
        },
        props: {
            user: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                showModal: false
            }
        },
        methods: {
            onShowModal() {
                this.showModal = true
            }
        }
    }
</script>

<style scoped>

</style>
