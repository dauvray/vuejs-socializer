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
                A accepté votre demande d'accès à <button
                    type="button"
                    class="btn btn-link"
                    @click="onGotoNetwork">{{notification.notification.data.network.name}}
                </button>
            </div>
            <date-helper
                :date="notification.created_at"
                :format="'since'"
            ></date-helper>
        </div>
    </div>
</template>

<script>
    import NotificationMixin from "vuejs-estarter/mixins/NotificationMixin"

    export default {
        name: "UserAccessNetworkAcceptedNotification",
        mixins: [
            NotificationMixin
        ],
        methods: {
            onGotoNetwork() {
                this['notifications/deleteNotification'](this.notification.id)
                .then(() => {
                    setTimeout(() => {
                        document.location = this.notification.notification.data.network.link
                    }, 500)
                })
            }
        }
    }
</script>

<style scoped>

</style>
