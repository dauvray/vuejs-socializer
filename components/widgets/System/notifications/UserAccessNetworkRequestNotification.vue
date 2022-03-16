<template>
    <div class="card card-notification" v-if="isActive">
        <div class="card-body">
            <author-widget
                :author="notification.notification.from"
                :profileurl="profileurl"
                size="small"
            ></author-widget>
            <button
                type="button"
                class="btn btn-link"
                @click="onDeleteNotification">
                <i class="lar la-trash-alt"></i>
            </button>
            <div>
                Demande un accès {{networkType}} <a :href="notification.notification.data.network.link">
                {{notification.notification.data.network.name}}</a>
            </div>
            <access-buttons
                :network="notification.notification.data.network"
                :user="notification.notification.from"
                @accept-user-network="onAcceptUser"
                @refuse-user-network="onRefuseUser"
            ></access-buttons>
            <date-helper
                :date="notification.created_at"
                :format="'since'"
            ></date-helper>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex"
    import NotificationMixin from "vuejs-estarter/mixins/NotificationMixin"

    export default {
        name: "UserAccessNetworkRequestNotification",
        components: {
            AccessButtons: () => import('vuejs-socializer/components/widgets/network/NetworkAccessAuthorizeBtn')
        },
        mixins: [
            NotificationMixin
        ],
        computed: {
            networkType: function() {
                switch(this.notification.notification.data.network.type) {
                    case 'group':
                        return 'au groupe'
                        break
                    case 'page':
                        return 'à la page'
                        break
                    case 'salon':
                        return 'au salon'
                        break
                }
            }
        },
        methods: {
            ...mapActions([
                'networks/acceptAccessRequest',
                'networks/refuseAccessRequest',
            ]),
            onAcceptUser() {
                this['networks/acceptAccessRequest']({
                    user_id: this.notification.notification.from.id,
                    network_id: this.notification.notification.data.network.id,
                }).then(() => {
                    this['notifications/deleteNotification'](this.notification.id)
                    this.isActive = false
                })
            },
            onRefuseUser() {
                this['networks/refuseAccessRequest']({
                    user_id: this.notification.notification.from.id,
                    network_id: this.notification.notification.data.network.id,
                }).then(() => {
                    this['notifications/deleteNotification'](this.notification.id)
                    this.isActive = false
                })
            }
        }
    }
</script>

<style scoped>

</style>
