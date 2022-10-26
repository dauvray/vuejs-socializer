<template>
   <article>
        <div class="d-flex justify-content-between">
            <span>
                <params-room-icon :room="room"></params-room-icon>
                {{ room.name}}
                <i v-if="room.private" class="las la-lock"></i>
            </span>
            <i class="las la-cog" title="Modifier" @click="onUpdateRoomModal"></i>
        </div>
    </article>
</template>

<script>

    import ParamsRoomIcon from './ParamsRoomIcon'

    export default {
        name: 'ParamsRoomBtn',
        components: {
            ParamsRoomIcon,
        },
        props: {
            room: {
                type: Object,
                required: true,
            }
        },
        methods: {
            onUpdateRoomModal() {
                this.$emit('show-modal', 'update-room-network-modal', {room_id: this.room.id})
            },
        }
    }
</script>
