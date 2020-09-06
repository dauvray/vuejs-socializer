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
        computed: {
            btnLabel() {
                return this.isfriend ? 'Retirer' : 'Se connecter'
            }
        },
        methods: {
            sendInvitation() {
                axios({
                    url: this.isfriend ? this.removeurl : this.invitationurl,
                    method: 'get',
                }).then((response) => {
                    this.eventBus.$emit("httpSuccess", response.data)
                }).catch( (error) => {
                    this.eventBus.$emit("httpError", error)
                })
            }
        }
    }
</script>

<style scoped>

</style>
