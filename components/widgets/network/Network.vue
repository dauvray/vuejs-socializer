<template>
    <article v-if="network" class="network-container h-100">
        <div class="sidebar d-flex flex-column">

            <!-- Modals -->
            <component
                v-bind:is="currentModalComponent"
                ref="modalComponent"
                :showmodal="showModal"
                @hide-modal="onHideModal"
            ></component>

            <!-- Network -->
            <params-network-btn
                :network="network"
                @show-modal="onShowModal"
            ></params-network-btn>

            <!-- Salons -->
            <div class="flex-grow-1">
                <div class="list-group">
                    <params-room-btn
                        v-for="(room, idx) in network.rooms"
                        type="button"
                        class="list-group-item list-group-item-action"
                        :key="`room-button-${idx}`"
                        :room="room"
                        @show-modal="onShowModal"
                    ></params-room-btn>
                </div>
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
    import ParamsRoomBtn from './widgets/ParamsRoomBtn'

    export default {
        name: "Network",
        components: {
          ParamsNetworkBtn,
          ParamsRoomBtn,
          CreateRoomNetworkModal: () => import('./modals/CreateRoomNetworkModal'),
          UpdateRoomNetworkModal: () => import('./modals/UpdateRoomNetworkModal'),
        },
        props: {
            networkSlug: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                // modalManager
                currentModalComponent: '',
                showModal: false,
            }
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
            onHideModal() {
                this.showModal = false
            },
            onShowModal(component) {
                this.currentModalComponent = component,
                this.showModal = true
            },
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
