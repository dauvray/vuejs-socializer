<template>
    <article v-if="network" class="network-container h-100">
        <div class="sidebar d-flex flex-column">

          <!-- Network -->
          <params-network-btn
            :network="network"
          ></params-network-btn>

          <!-- Salons -->
          <div class="flex-grow-1">
              Salons
          </div>


          <!-- utilisateur -->
          <div>
             Params
          </div>


        </div>
      <div class="network">

        <div class="header">
          Header
        </div>
        <div class="content">
          content

        </div>
        <div class="rightbar">

          rightbar
        </div>

        <div class="footer">
          footer
        </div>

      </div>

    </article>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import ParamsNetworkBtn from './widgets/ParamsNetworkBtn'

    export default {
        name: "Network",
        components: {
          ParamsNetworkBtn,
        },
        props: {
            networkSlug: {
                type: String,
                required: false
            }
        },
        data() {
            return {}
        },
         computed: {
            ...mapGetters({
                network: 'networks/getNetwork'
               // me: 'me/getMe'
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

<style lang="scss" scoped>
      .network-container {
        display: grid;
        gap: 5px;

        grid-template-columns: 10rem 1fr;
        grid-template-rows: auto;

        grid-template-areas: 
        'sidebar network';       
      }


      .network {
        grid-area: network;
      }

      .sidebar {
        grid-area: sidebar;
      }


      /* network */
      .network {
        display: grid;
        gap: 5px;
        grid-template-columns: 1fr 10rem;
        grid-template-rows: 5rem 1fr 5rem;
      }


      .header {
        grid-column-start:1;
        grid-column-end:3;
      }

      .rightbar {
        grid-column-start:2;
        grid-row:2 /span 2;
      }

</style>
