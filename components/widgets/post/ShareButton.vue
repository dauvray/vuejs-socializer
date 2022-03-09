<template>
    <button
        type="button"
        class="btn btn-link"
        @click="onShare"
    >
        <i class="las la-share-alt-square"></i> Partager
    </button>
</template>

<script>
    export default {
        name: "ShareButton",
        methods: {
            onShare() {
                this.$emit('share-item')
            }
        }
    }
</script>

<style scoped>

</style>
