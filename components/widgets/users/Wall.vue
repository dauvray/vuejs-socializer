<template>
    <article id="socializer-wall" class="row">
        <section class="col-12 mb-3">
            <cover-user
                size="medium"
                :user="user"
                :webrtc="webrtc"
                :editroute="editroute"
                :editable="isEditable"
            ></cover-user>
        </section>
        <section class="col-md-3">
            <relations-widget
                :user="user"
                :profileurl="profileurl"
            ></relations-widget>
        </section>
        <section class="col-md-9">
            <feed-widget
                :feed="feed"
                :type="type"
                :user="user"
                :logged="logged"
                :canbecommented="canbecommented"
                :canberated="canberated"
                :canbeliked="canbeliked"
                :canbereported="canbereported"
                :canbedeleted="canbedeleted"
                :profileurl="profileurl"
                :postpublishurl="postpublishurl"
                :postcommenturl="postcommenturl"
                :postlikeurl="postlikeurl"
                :postdislikeurl="postdislikeurl"
                :postreporturl="postreporturl"
            ></feed-widget>
        </section>
    </article>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Wall",
        components: {
            CoverUser: () => import('vuejs-socializer/components/widgets/cover/CoverUser'),
            FeedWidget: () => import('vuejs-socializer/components/widgets/Feed'),
            RelationsWidget: () => import('vuejs-socializer/components/widgets/users/Relations')
        },
        props: {
            user: {
                type: Object,
                required: true
            },
            editroute: {
                type: String,
                required: false,
                default: ''
            },
            editable: {
                type: Boolean,
                required: false,
                default: false
            },
            type: {
                type: String,
                required: true,
            },
            feed: {
                type: [Array, Object],
                required: true
            },
            logged: {
                type: Boolean,
                default: false
            },
            webrtc: {
                type: Boolean,
                required: false,
                default: false
            },
            canbecommented: {
                type: Boolean,
                default: false
            },
            canberated: {
                type: Boolean,
                default: false
            },
            canbeliked: {
                type: Boolean,
                default: false
            },
            canbedeleted: {
                type: Boolean,
                default: false
            },
            canbereported: {
                type: Boolean,
                default: false
            },
            postlikeurl: String,
            postdislikeurl: String,
            postreporturl: String,
            postcommenturl: String,
            postpublishurl: String,
            profileurl: String,
        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
            }),
            isEditable: function() {
                return this.me.id === this.user.id
            }
        }
    }
</script>

<style scoped>

</style>
