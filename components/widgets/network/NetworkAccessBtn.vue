<template>
    <div v-if="network && !haveSendedRequest">
        <a v-if="isAllowed"
           :href="network.link"
           class="btn btn-primary"
        ><i class="las la-door-open"></i> Visiter</a>
        <button v-else
                type="button"
                class="btn btn-primary"
                @click="onAccessRequest"
        ><i class="las la-key"></i> Demander un accès</button>
    </div>
    <span v-else class="badge rounded-pill bg-warning text-dark">Demande d'accès en cours</span>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: "NetworkAccessBtn",
        props: {
            network: {
                type: Object,
                required: true,
            }
        },
        data() {
          return {
              sendedRequest: false
          }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
            }),
            isAllowed: function() {
                if(!this.network.is_private) {
                    return true
                }

                if(this.me.hasOwnProperty('networks')) {
                    return this.me.networks.includes(this.network.slug) ||  this.me.ownedNetworks.includes(this.network.slug)
                }

                return false
            },
            haveSendedRequest: function() {
                if(this.sendedRequest) {
                    return true
                } else if(this.me.hasOwnProperty('sendedNetworkRequests')) {
                    return this.me.sendedNetworkRequests.includes(this.network.slug)
                }
            }
        },
        methods: {
            ...mapActions([
                'networks/sendAccessRequest'
            ]),
            onAccessRequest() {
                this['networks/sendAccessRequest'](this.network.id)
                .then(() => {
                    this.sendedRequest = true
                })
            }
        }
    }
</script>

<style scoped>

</style>
