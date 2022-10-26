<template>
    <div id="params-network-btn">
        <div class="dropdown">
            <button
                class="btn btn-secondary dropdown-toggle w-100"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {{ network.name}}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item"
                        :href="void(0)"
                        @click="onCreateRoomModal">Créer un salon</a>
                </li>
                <li><a class="dropdown-item" href="#">Paramètres du réseau</a></li>
                <li><hr class="dropdown-divider"></li>
            </ul>
        </div>
    </div>
</template>

<script>
     export default {
        name: 'paramsNetworkBtn',
        props: {
            network: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {}
        },
        methods: {
            onCreateRoomModal() {
                this.$emit('show-modal', 'create-room-network-modal')
            },
        }
     }
</script>
