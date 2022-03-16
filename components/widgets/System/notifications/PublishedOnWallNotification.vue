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
                A publié sur <a :href="`/${profileurl}/${me.slug}`">votre mur</a>
            </div>
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
        name: "PublishedOnWallNotification",
        mixins: [
            NotificationMixin
        ]
    }
</script>

<style scoped>

</style>
