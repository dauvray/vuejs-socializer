<template>
    <article v-if="active">
        <div class="d-flex">
            <gravatar-widget
                class="me-3"
                :user="network"
                :status="false"
            ></gravatar-widget>

            <div class="flex-grow-1">
                <h1>{{network.name}}</h1>
                <span class="badge bg-warning text-dark">{{formatNetworkType(network.type)}}</span>
            </div>

            <follow-button
                v-if="!isOwner"
                :network="network"
                @unfollow-network="active=false"
            ></follow-button>
        </div>
        <network-menu
            class="mt-3 mb-3"
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
            GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
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
                currentComponent: 'WallComponent',
                active: true
            }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe'
            }),
            isOwner: function() {
                if(this.me.hasOwnProperty('ownedNetworks')){
                    return this.me.ownedNetworks.includes(this.network.slug)
                }
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
            },
            formatNetworkType(type) {
                switch(type) {
                    case 'group':
                        return 'Groupe'
                        break
                    case 'page':
                        return 'Page'
                        break
                    case 'salon':
                        return 'Salon'
                        break
                }
            }
        }
    }
</script>

<style scoped>

</style>
