<template>
    <div class="card card-notification" v-if="isActive">
        <div class="card-body">
            <author-widget
                :author="fromUser"
                :profileurl="profileurl"
                size="small"
            ></author-widget>
            <div>Vous a envoyé une demande en ami</div>
            <date-helper
                :date="notification.created_at"
                :format="'since'"
            ></date-helper>
            <users-btn
                :user="fromUser"
                @accept-new-invitation="onAcceptInvitation"
                @deny-invitation="onDenyInvitation"
            ></users-btn>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "FriendInvitationNotification",
        components: {
            AuthorWidget: () => import('vuejs-estarter/components/widgets/Author'),
            DateHelper: () => import('vuejs-eblogger/components/widgets/DateHelper'),
            UsersBtn: () => import('vuejs-socializer/components/widgets/users/UsersBtn'),
        },
        props: {
            notification: {
                type: Object,
                required: true
            },
            profileurl: {
                type: String,
                required: false,
                default: ''
            }
        },
        data() {
            return {
              isActive: true
            }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
            }),
            fromUser: function() {
                let user = {...this.notification.notification.from}
                user.sendedfriendRequests = false
                user.friends = false
                user.receivedfriendRequests = false

                this.notification.notification.from.sendedfriendRequests.forEach(item => {
                    if(item.id == this.me.id){
                        user.sendedfriendRequests = true
                    }
                })

                this.notification.notification.from.receivedfriendRequests.forEach(item => {
                    if(item.id == this.me.id){
                        user.receivedfriendRequests = true
                    }
                })

                this.notification.notification.from.friends.forEach(item => {
                    if(item.id == this.me.id){
                        user.friends = true
                    }
                })

                return user
            }
        },
        methods: {
            ...mapActions([
                'users/acceptInvitation',
                'users/denyInvitation',
                'notifications/deleteNotification'
            ]),
            onAcceptInvitation(userId) {
                this['users/acceptInvitation'](userId)
                this['notifications/deleteNotification'](this.notification.id)
                this.isActive = false
            },
            onDenyInvitation(userId) {
                this['users/denyInvitation'](userId)
                this['notifications/deleteNotification'](this.notification.id)
                this.isActive = false
            }
        }
    }
</script>

<style scoped>

</style>
