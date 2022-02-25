<template>
    <div>
        <feed-widget
            :feed="{data:[], links:{}, meta:{}}"
            type="network"
            :user="network"
            :logged="false"
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
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "Wall",
        components: {
            FeedWidget: () => import('vuejs-socializer/components/widgets/Feed'),
        },
        props: {
            network: {
                type: Object,
                required: true
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
        created() {
            this['networks/getWall'](this.network.slug)
        },
        methods: {
            ...mapActions([
                'networks/getWall'
            ]),
        }
    }
</script>

<style scoped>

</style>
