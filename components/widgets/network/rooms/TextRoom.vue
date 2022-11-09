<template>
    <div>
        <h1>{{ room.name }}</h1>
        <feed-widget
            :feed-id="room.feed_id"
            type="room"
        ></feed-widget>
    </div>
</template>

<script>
    import FeedWidget from 'vuejs-socializer/components/widgets/Feed'

    export default {
        name: 'TextRoom',
        props: {
            room: {
                type: Object,
                required: true
            }
        },
        data() {
            return {

            }
        }
    }
</script>
