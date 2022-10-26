<template>
    <i :class="iconClass"></i>
</template>

<script>
    export default {
        name: 'ParamsRoomIcon',
        props: {
            room: {
                type: Object,
                required: true
            }
        },
        computed: {
            iconClass: function() {
                switch( this.room.type) {
                    case 'voice':
                        return 'las la-volume-up'
                        break
                    case 'data':
                        return 'las la-database'
                        break
                    default:
                        return 'las la-hashtag'
                        break
                }
            }
        }
    }
</script>
