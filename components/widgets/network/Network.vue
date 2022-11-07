<template>
    <article v-if="network" class="network-container h-100">
        <div class="sidebar d-flex flex-column">

            <!-- Modals -->
            <component
                v-bind:is="currentModalComponent"
                ref="modalComponent"
                :showmodal="showModal"
                :payload="payload"
                @hide-modal="onHideModal"
            ></component>

            <!-- Network -->
            <params-network-btn
                class="pb-3"
                :network="network"
                @show-modal="onShowModal"
            ></params-network-btn>

            <!-- Rooms -->
            <div class="flex-grow-1">
                <div class="list-group">
                    <params-room-btn
                        v-for="(room, idx) in network.rooms"
                        type="button"
                        class="list-group-item list-group-item-action"
                        :class="{active: isRoomActive(room.id)}"
                        :key="`room-button-${idx}`"
                        :room="room"
                        @show-modal="onShowModal"
                        @load-room="onLoadRoom"
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
            <router-view></router-view>
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
          RoomComponent: () => import('./rooms/Room'),
        },
        props: {
            networkSlug: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                currentModalComponent: '',
                showModal: false,
                payload: {},
            }
        },
         computed: {
            ...mapGetters({
                network: 'networks/getNetwork',
                currentRoom: 'networks/getRoom',
            }),
        },
        created() {
           let slug = this.networkSlug || this.$route.params.networkSlug
            this['networks/loadNetwork'](slug)

        },
        methods: {
             ...mapActions([
                'networks/loadNetwork',
                'networks/loadRoom'
            ]),
            onHideModal() {
                this.showModal = false
            },
            onShowModal(component, payload) {
                this.currentModalComponent = component,
                this.payload = {...payload}
                this.showModal = true
            },
            onLoadRoom(roomId) {
                this['networks/loadRoom'](roomId)
                .then(() => {
                    this.$router.push({ name: `room`, params: { roomId: roomId } })
                })
            },
            isRoomActive(roomId) {
                if(this.currentRoom) {
                    return roomId == this.currentRoom.id
                }

                return false
            }
        }
    }
</script>

<style lang="scss" scoped>

      .network-container {
        display: grid;
        gap: 15px;
        grid-template-columns: 20rem 1fr;
        grid-template-rows: auto;
        grid-template-areas: 'sidebar network';
      }

      .sidebar {
        grid-area: sidebar;
      }

      .network {
        display: grid;
        gap: 5px;
        grid-area: network;
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
