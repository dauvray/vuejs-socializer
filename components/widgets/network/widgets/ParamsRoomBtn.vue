<template>
   <article>
        <div class="d-flex justify-content-between">
            {{ room.name}}
            <i class="las la-cog" title="Modifier" @click="onUpdateRoomModal"></i>
        </div>
    </article>
</template>

<script>

    export default {
        name: 'ParamsRoomBtn',
        props: {
            room: {
                type: Object,
                required: true,
            }
        },
        methods: {
            onUpdateRoomModal() {
                this.$emit('show-modal', 'update-room-network-modal')
            },
        }
    }
</script>
