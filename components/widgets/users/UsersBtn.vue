<template>
    <div>
        <button v-if="user.friends"
            type="button"
            class="btn btn-sm btn-danger"
            @click="onRemoveFriend(user.id)"
        ><i class="las la-user-alt-slash"></i> Bloquer</button>
        <button v-else-if="user.receivedfriendRequests"
            type="button"
            class="btn btn-sm btn-warning"
            @click="onCancelInvitation(user.id)"
        >Annuler invitation</button>
        <template v-else-if="user.sendedfriendRequests">
            <button class="btn btn-sm btn-success"
                type="button"
                @click="onAcceptInvitation(user.id)"
            ><i class="las la-user-friends"></i> Accepter invitation</button>
            <button class="btn btn-sm btn-warning"
                type="button"
                @click="onDenyInvitation(user.id)"
            ><i class="las la-user-times"></i> Décliner invitation</button>
        </template>
        <button v-else
            type="button"
            class="btn btn-sm btn-primary"
            @click="onInviteFriend(user.id)"
        ><i class="las la-user-plus"></i> Suivre</button>
    </div>
</template>

<script>

export default {
    name: 'UsersBtn',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        onInviteFriend(userId) {
            this.$emit('add-new-friend', userId)
        },
        onCancelInvitation(userId) {
            this.$emit('cancel-new-invitation', userId)
        },
        onAcceptInvitation(userId) {
            this.$emit('accept-new-invitation', userId)
        },
        onRemoveFriend(userId) {
            this.$emit('remove-friend', userId)
        },
        onDenyInvitation(userId) {
            this.$emit('deny-invitation', userId)
        }
    }
}
</script>

<style scoped>

</style>
