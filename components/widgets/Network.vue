<template>
    <article>
        <div class="d-flex">
            <h1 class="flex-grow-1">{{network.name}}</h1>
            <small>{{network.type}}</small>
            <follow-button
                :network="network"
            ></follow-button>
        </div>
        <network-menu
            :current-component="currentComponent"
            @selected-component="onSelectedComponent"
        ></network-menu>
        <component
            v-bind:is="currentComponent"
            ref="networkComponent"
            :network="network"
            :type="type"
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
        ></component>
    </article>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "Network",
        components: {
            AboutComponent: () => import('vuejs-socializer/components/widgets/network/About'),
            UsersComponent: () => import('vuejs-socializer/components/widgets/network/Users'),
            WallComponent: () => import('vuejs-socializer/components/widgets/network/Wall'),
            FollowButton: () => import('vuejs-socializer/components/widgets/network/FollowBtn'),
            NetworkMenu: () => import('vuejs-socializer/components/widgets/network/NetworkMenu'),
        },
        props: {
            network: {
                type: Object,
                required: true
            },
            type: {
                type: String,
                required: true,
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
            return {
                currentComponent: 'AboutComponent',
            }
        },
        created() {
            this['networks/setNetwork'](this.network)
        },
        methods: {
            ...mapActions([
                'networks/setNetwork'
            ]),
            onSelectedComponent(component) {
                this.currentComponent = component
            }
        }
    }
</script>

<style scoped>

</style>
