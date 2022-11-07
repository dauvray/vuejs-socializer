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
                :feed-id="wall.feed.id"
                :type="type"
                :item="user"
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
                @publish-post="onPublishPost"
            ></feed-widget>
        </section>
    </article>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

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
                required: false,
                default: 'wall'
            },
/*             feed: {
                type: [Array, Object],
                required: true
            }, */
            wall: {
                type: Object,
                required: true,
            },
/*             logged: {
                type: Boolean,
                default: false
            }, */
            webrtc: {
                type: Boolean,
                required: false,
                default: false
            },
            canbecommented: {
                type: Boolean,
                default: true
            },
            canberated: {
                type: Boolean,
                default: false
            },
            canbeliked: {
                type: Boolean,
                default: true
            },
            canbedeleted: {
                type: Boolean,
                default: true
            },
            canbereported: {
                type: Boolean,
                default: true
            },
            postlikeurl: String,
            postdislikeurl: String,
            postreporturl: String,
            postcommenturl: String,
            postpublishurl: String,
            profileurl: {
                type: String,
                required: false,
                default: 'profil'
            },
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
        },
        methods: {
            ...mapActions([
                'posts/publishWallPost'
            ]),
            onPublishPost(data) {
                this['posts/publishWallPost'](data)
                .then(() => {
                   //
                })
            }
        }
    }
</script>

<style scoped>

</style>
