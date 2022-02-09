<template>
    <div>
        <gravatar-widget
            :user="sender" />
        <button type="button" class="btn btn-danger" @click="onRefuseCall" >Refuser</button>
        <button type="button" class="btn btn-success" @click="onAcceptCall" >Accepter</button>
    </div>
</template>

<script>
    import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'
    import {mapActions} from 'vuex'

    export default {
        name: "VideoCallRequestModal",
        components: {
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        },
        props: {
            notification: {
                type: Object,
                required: true,
            }
        },
        computed: {
            sender: function() {
                return this.notification.notification.from
            }
        },
        methods: {
            ...mapActions([
                'notifications/deleteNotification',
            ]),
            onHideModal() {
                this.$emit('hide-modal')
            },
            onRefuseCall() {
                RestDataSourcesMixin.methods.requestApi(`/refuse-video-call/${this.notification.id}`)
                .then(resp => {
                    this.onHideModal()
                })
            },
            onAcceptCall() {
                this['notifications/deleteNotification'](this.notification.id)
                .then(() => {
                    this.$emit('accept-call')
                })
            }
        }
    }
</script>

<style scoped>

</style>
