<template>
    <div>
        <button
            type="button"
            class="btn btn-success"
            @click="onAcceptUser"
        >Accepter</button>
        <button
            type="button"
            class="btn btn-danger"
            @click="onRefuseUser"
        >Refuser</button>
    </div>
</template>

<script>
    export default {
        name: "NetworkAccessAuthorizeBtn",
        methods: {
            onAcceptUser() {
                this.$emit('accept-user-network')
            },
            onRefuseUser() {
                this.$emit('refuse-user-network')
            }
        }
    }
</script>

<style scoped>

</style>
