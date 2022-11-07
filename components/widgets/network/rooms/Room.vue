<template>
    <component
        v-bind:is="currentRoomComponent"
        ref="roomComponent"
        :room="room"
    ></component>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'Room',
        components: {
            TextRoom: () => import('./TextRoom'),
        },
        computed: {
            ...mapGetters({
                room: 'networks/getRoom',
            }),
            currentRoomComponent: function() {
                if(this.room) {
                    return `${this.room.type}-room`
                }
                return ''
            }
        },
        mounted() {
            if(!this.room) {
                this['networks/loadRoom'](this.$route.params.roomId)
            }
        },
        methods: {
            ...mapActions([
                'networks/loadRoom'
            ])
        }
    }
</script>
