<template>
    <div>
        <card-network
            v-for="(network, idx) in networks.data"
            :key="`network-${idx}`"
            :network="network"
        ></card-network>
        <network-pagination
            :items="networks"
            @loadPage="onLoadNetworks"
        ></network-pagination>
    </div>
</template>

<script>

    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "Networks",
         components: {
            CardNetwork: () => import('./CardNetwork'),
            NetworkPagination: () => import('vuejs-estarter/components/widgets/Pagination'),
        },
        computed: {
            ...mapGetters({
                networks: 'networks/getNetworks'
            })
        },
        created() {
            this.onLoadNetworks()
        },
        methods: {
            ...mapActions([
                'networks/loadNetworks'
            ]),
            onLoadNetworks(url = '/get-networks') {
                this['networks/loadNetworks'](url)
            }
        }
    }
</script>

<style scoped>

</style>
