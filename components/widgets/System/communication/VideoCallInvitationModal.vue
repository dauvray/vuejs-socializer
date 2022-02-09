<template>
    <div>
        <spinner-widget
            v-if="showSpinner"
        ></spinner-widget>

        <h1>{{message}}</h1>

        <div class="d-flex">
            <gravatar-widget
                :user="user"
            ></gravatar-widget>
            <div>
                <span class="user-name">{{ user.name}}</span>
                <span class="user-function text-muted">{{ user.function}}</span>
            </div>

            <button
                v-if="!refused"
                type="button"
                class="btn btn-danger"
                @click="onCancelCall"
            >Annuler</button>
            <button
                v-else
                type="button"
                class="btn btn-danger"
                @click="onHideModal"
            >Fermer</button>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "VideoCallInvitationModal",
        components: {
            SpinnerWidget: () => import('vuejs-socializer/components/widgets/System/communication/Spinner'),
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        },
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        data() {
           return {
               showSpinner: true,
               refused: false,
               message: 'Appel en cours'
           }
        },
        watch: {
            notifications: function (val) {
                this.checkNotifications()
            },
        },
        computed: {
            ...mapGetters({
                notifications: 'notifications/getNotifications',
            }),
        },
        methods: {
            ...mapActions([
                'notifications/pushNotification',
                'notifications/deleteNotification',
            ]),
            onHideModal() {
                this.$emit('hide-modal')
            },
            onCancelCall() {
                this['notifications/pushNotification']({
                        to: this.user.id,
                        data: {
                            type: 'video_call_canceled',
                        }
                })
                .then(() => {
                    this.$emit('cancel-call')
                })
            },
            refusedCall(notifId) {
                this.message = 'Appel rejeté'
                this.showSpinner = false
                this['notifications/deleteNotification'](notifId)
                .then(() => {
                    this.refused = true
                })
            },
            acceptedCall(notifId) {
                this['notifications/deleteNotification'](notifId)
                .then(() => {
                    this.$emit('accepted-call')
                })
            },
            checkNotifications() {
                this.notifications.forEach((notif, idx) => {
                    if(notif.notification.data.type == 'video_call_refused' && notif.notification.from.id == this.user.id) {
                        this.refusedCall(notif.id)
                    }
                    if(notif.notification.data.type == 'video_call_accepted' && notif.notification.from.id == this.user.id) {
                        this.acceptedCall(notif.id)
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
