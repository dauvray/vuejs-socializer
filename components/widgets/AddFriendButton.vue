<template>
    <button type="button" class="btn btn-primary btn-sm" @click="sendInvitation">
        <i class="fas fa-user-plus"></i> {{ btnLabel }}
    </button>
</template>

<script>
    export default {
        name: "AddFriendBtn",
        inject: ["eventBus"],
        props: {
            invitationurl: {
                type: String,
                required: true
            },
            removeurl: {
                type: String,
                required: true
            },
            isfriend: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                status: this.isfriend
            }
        },
        computed: {
            btnLabel() {
                return this.status ? 'Retirer' : 'Se connecter'
            }
        },
        methods: {
            sendInvitation() {
                axios({
                    url: this.status ? this.removeurl : this.invitationurl,
                    method: 'get',
                }).then((response) => {
                    this.eventBus.$emit("httpSuccess", response.data.notification)
                    this.status = response.data.status
                }).catch( (error) => {
                    this.eventBus.$emit("httpError", error)
                })
            }
        }
    }
</script>

<style scoped>

</style>
