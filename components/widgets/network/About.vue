<template>
    <div>
        <h2>Administrateur</h2>
        <author-widget
            class="flex-grow-1"
            :author="network.owner"
            :profileurl="profileurl"
        ></author-widget>

        <h2>Description</h2>
        <div v-html="network.description"></div>
    </div>
</template>

<script>
export default {
    name: "About",
    components: {
        AuthorWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Author'),
    },
    props: {
        network: {
            type: Object,
            required: true
        },
        profileurl: {
            type: String,
            required: true
        }
    },
}
</script>

<style scoped>

</style>
