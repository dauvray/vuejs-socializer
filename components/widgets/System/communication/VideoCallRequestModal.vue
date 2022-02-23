<template>
    <div>
        <spinner-widget
        ></spinner-widget>
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
            SpinnerWidget: () => import('vuejs-socializer/components/widgets/System/communication/Spinner'),
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        },
        props: {
            notification: {
                type: Object,
                required: true,
            }
        },
        data() {
           return {
               audio: null
           }
        },
        computed: {
            sender: function() {
                return this.notification.notification.from
            }
        },
        created() {
            this.audio = new Audio('/vendor/socializer/phone-ring.mp3')
        },
        mounted() {
            this.audio.play()
        },
        methods: {
            ...mapActions([
                'notifications/deleteNotification',
            ]),
            onHideModal() {
                this.$emit('hide-modal')
            },
            stopAudio() {
                this.audio.pause()
                this.audio.currentTime = 0
                this.audio.src = ''

                this.audio.load()
                this.audio = null
            },
            onRefuseCall() {
                this.stopAudio()
                RestDataSourcesMixin.methods.requestApi(`/refuse-video-call/${this.notification.id}`)
                .then(resp => {
                    this.onHideModal()
                })
            },
            onAcceptCall() {
                this.stopAudio()
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
