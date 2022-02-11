<template>
    <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="handleVideoFilter"
    ><i class="las la-palette"></i></button>
</template>

<script>
    export default {
        name: "WebcamFilterBtn",
        data() {
            return {
                filters: ['grayscale', 'sepia', 'noir', 'psychedelic', 'none'],
            }
        },
        methods: {
            handleVideoFilter() {
                const filter = `filter-${this.cycleFilter()}`
                this.$emit('apply-filter', filter)
            },
            cycleFilter() {
                const filter = this.filters.shift()
                this.filters.push(filter)
                return filter
            },
        }
    }
</script>

<style scoped>

</style>
