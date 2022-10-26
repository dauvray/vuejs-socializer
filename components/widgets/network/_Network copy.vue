<template>
    <article v-if="active">
        <div class="row">
            <div class="col-md-2">

                <div class="d-flex flex-column">

                    <div >
                        Network de Admin
                    </div>

                    <div class="flex-grow-1">
                        Salons
                    </div>

                    <div>
                        Gravatar
                    </div>

                </div>

            </div> 
            <div class="col-md-10">
                
            </div> 
            
           

        </div>

    </article>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "Network",
        components: {
        //    GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
        },
        props: {
            networkSlug: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                active: true
            }
        },
         computed: {
            ...mapGetters({
                network: 'networks/getNetwork'
            }),
        },
        created() {
           let slug = this.networkSlug || this.$route.params.networkSlug
            this['networks/loadNetwork'](slug)
 
        },
        methods: {
             ...mapActions([
                'networks/loadNetwork'
            ]),
        }
    }
</script>

<style scoped>

</style>
