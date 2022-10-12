<template>
    <div>
        <button
            v-if="!isNetworkFollowed"
            type="button"
            class="btn btn-primary"
            @click="onFollowNetwork"
        ><i class="las la-link"></i> S'abonner</button>
        <button
            v-else
            type="button"
            class="btn btn-secondary"
            @click="onUnfollowNetwork"
        ><i class="las la-unlink"></i> Se désabonner</button>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: "FollowBtn",
        props: {
           network: {
               type: Object,
               required: true
           }
        },
        computed: {
            ...mapGetters({
                myNetworks: 'networks/getMyNetworks',
            }),
           isNetworkFollowed: function() {
                return this.myNetworks.includes(this.network.slug)
           }
        },
        methods: {
            ...mapActions([
                'networks/followNetwork',
                'networks/unfollowNetwork',
            ]),
            onFollowNetwork() {
                this['networks/followNetwork'](this.network.slug)
            },
            onUnfollowNetwork() {
                if(confirm('Souhaitez-vous quitter ce groupe ?')) {
                    this['networks/unfollowNetwork'](this.network.slug)
                    .then(() => {
                        if(this.network.is_private) {
                            this.$emit('unfollow-network')
                            setTimeout(() => {
                                document.location = '/networks'
                            }, 1000)
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
