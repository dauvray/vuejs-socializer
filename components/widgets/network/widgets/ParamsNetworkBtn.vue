<template>

    <div id="params-network-btn">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ network.name}}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" 
                        :href="void(0)" 
                        @click="onShowNetworkModal"
                    >Créer un salon</a>
                </li>
                <li><a class="dropdown-item" href="#">Paramètres du réseau</a></li>
                <li><hr class="dropdown-divider"></li>
            </ul>
        </div>

        <component 
            v-bind:is="currentModalComponent"
            ref="modalComponent"
            :showmodal="showModal"
            @hide-modal="onHideModal"
        ></component>
    </div>

</template>

<script>

     export default {
        name: 'paramsNetworkBtn',
        components: {
            CreateRoomNetworkModal: () => import('../modals/CreateRoomNetworkModal'),
        },
        props: {
            network: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                currentModalComponent: '',
                showModal: false,
            }
        },
        methods: {
            onShowNetworkModal() {
                this.currentModalComponent = 'create-room-network-modal',
                this.showModal = true
            },
            onHideModal() {
                this.showModal = false
            }
        }
     }
</script>