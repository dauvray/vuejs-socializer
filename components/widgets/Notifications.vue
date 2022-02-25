<template>
    <modal-widget
        v-if="showModal"
        target="videoCall"
        class="d-flex justify-content-end"
        modalClasses="modal-fullscreen"
        btnclass="btn btn-link"
        :trigger="showModal"
        :backdrop="'static'"
        :keyboard="false"
        :showBtn="false"
        :closebutton="false"
        @hide="onHideModal">
        <template #header>
            <i class="fas fa-cog"></i> Appel Vidéo
        </template>
        <template #body>
            <component
                v-bind:is="currentModalComponent"
                :notification="currentNotification"
                @accept-call="onAcceptCall"
                @hide-modal="onHideModal"
            ></component>
        </template>
        <template #footer>
            {{''}}
        </template>
    </modal-widget>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "Notifications",
        components: {
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            VideoCallRequestModal: () => import('vuejs-socializer/components/widgets/System/communication/VideoCallRequestModal'),
            WebRtcWrapper: () => import('vuejs-socializer/components/widgets/System/communication/WebRTCWrapper'),
        },
        data() {
            return {
                userInitialized: false,
                showModal: false,
                currentModalComponent: null,
                currentNotification: null,
            }
        },
        watch: {
            notifications: function (val) {
                this.checkNotifications()
            },
            me: function(user) {
                if(user.hasOwnProperty('id') && !this.userInitialized) {
                    this.userInitialized = true
                    this['users/loadSocializerMe']()
                }
            }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
                notifications: 'notifications/getNotifications',
            }),
        },
        methods: {
            ...mapActions([
                'notifications/pushNotification',
                'notifications/deleteNotification',
                'users/loadSocializerMe'
            ]),
            onShowModal() {
                this.showModal = true
            },
            onHideModal() {
                this.showModal = false
                this.currentModalComponent = null
                this.currentNotification = null
            },
            checkNotifications() {
                this.notifications.forEach((notif, idx) => {
                    if(notif.notification.data.type == 'video_call_invitation') {
                        this.displayVideoCallModalRequest(notif)
                    }
                    if(notif.notification.data.type == 'video_call_canceled') {
                        this.cancelVideoCallModalRequest(notif)
                    }
                })
            },
            // Video Call
            displayVideoCallModalRequest(notification) {
                this.currentModalComponent = 'VideoCallRequestModal'
                this.currentNotification = notification
                this.onShowModal()
            },
            cancelVideoCallModalRequest(notification) {
                this['notifications/deleteNotification'](notification.id)
                .then(() => {
                    this.onHideModal()
                })
            },
            onAcceptCall() {
                this['notifications/pushNotification']({
                        to: this.currentNotification.notification.from.id,
                        data: {
                            type: 'video_call_accepted',
                        }
                })
                .then(() => {
                    this.currentModalComponent = 'WebRtcWrapper'
                })
            }
        }
    }
</script>

<style scoped>

</style>
