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
    import friend_invitation from 'vuejs-socializer/components/widgets/System/notifications/FriendInvitationNotification'
    import Vue from "vue"

    export default {
        name: "Notifications",
        inject: ["eventBus"],
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
                availableNotificationsType: [
                    'friend_invitation'
                ]
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
        created() {
            this.eventBus.$on('format-notification', this.onFormatNotification)
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
            },
            // user activity notifications
            onFormatNotification(notification, profileurl) {
                if(this.availableNotificationsType.includes(notification.notification.data.type)) {
                    this.formatNotification(notification, profileurl)
                }
            },
            formatNotification(notification, profileurl) {

                // use type to define current notification card component
                let CardNotification

                switch(notification.notification.data.type) {
                    case 'friend_invitation':
                        CardNotification = friend_invitation
                        break
                }

                let cardNotif = new Vue({
                    ...CardNotification,
                    parent: this,
                    propsData: {
                        notification: notification,
                        profileurl: profileurl,
                    }
                }).$mount()
                this.eventBus.$emit('receive-formated-notification', cardNotif.$el)
            }
        }
    }
</script>

<style scoped>

</style>
