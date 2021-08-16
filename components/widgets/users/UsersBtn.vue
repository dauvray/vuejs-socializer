<template>
    <div>
        <button v-if="user.is_friend" 
            type="button"
            class="btn btn-primary"
            @click="onRemoveFriend(user)"
        >Bloquer</button>
        <button v-else-if="user.sended_invitation" 
            type="button"
            class="btn btn-primary"
            @click="onCancelInvitation(user)"
        >Annuler invitation</button>
        <template v-else-if="user.received_invitation">
            <button class="btn btn-primary"
                type="button"
                @click="onAccepteInvitation(user)"
            >Accepter invitation</button>
            <button class="btn btn-primary"
                type="button"
                @click="onDenyInvitation(user)"
            >Décliner invitation</button>
        </template>
        <button v-else
            type="button"
            class="btn btn-primary"
            @click="onInviteFriend(user)"
        >Inviter</button>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'UsersBtn',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions([
            'users/addFriend',
            'users/removeFriend',
            'users/cancelInvitation',
            'users/accepteInvitation',
            'users/denyInvitation'
        ]),
        onInviteFriend(user) {
            this['users/addFriend'](user)
        },
        onCancelInvitation(user) {
            this['users/cancelInvitation'](user)
        },
        onAccepteInvitation(user) {
            this['users/accepteInvitation'](user)
        },
        onRemoveFriend(user) {
            this['users/removeFriend'](user)
        },
        onDenyInvitation(user) {
            this['users/denyInvitation'](user)
        }
    }
}
</script>

<style scoped>

</style>
