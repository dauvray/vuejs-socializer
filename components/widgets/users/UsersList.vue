<template>
    <div>
        <div v-for="(user, idx) in users"
        class="card mb-2"
        :key="idx"
        >
            <div class="card-body p-2 d-flex align-items-center">
                <div class="d-flex align-items-center flex-grow-1">
                    <gravatar-status :user="user"></gravatar-status>
                    <user-link
                        class="d-flex flex-column"
                        :user="user"
                        :profileurl="profileurl"
                    ></user-link>
                </div>
                <users-btn
                    :user="user"
                    @add-new-friend="onInviteFriend"
                    @cancel-new-invitation="onCancelInvitation"
                    @accept-new-invitation="onAcceptInvitation"
                    @remove-friend="onRemoveFriend"
                    @deny-invitation="onDenyInvitation"
                ></users-btn>
            </div>
        </div>

        <pagination-widget
            :items="users"
            @loadPage="onLoadPage"
        ></pagination-widget>
    </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex'

export default {
    name: 'UsersList',
    components: {
        PaginationWidget: () => import('vuejs-estarter/components/widgets/Pagination'),
        GravatarStatus: () => import('../user/GravatarStatus'),
        UserLink: () => import('../user/UserLink'),
        UsersBtn: () => import('./UsersBtn'),
    },
    props: {
        profileurl: {
            type: String,
            required: true
        }
    },
    data() {
        return {}
    },
    created() {
        this['users/loadUsers']()
    },
    computed: {
        ...mapGetters({
            users: 'users/getUsers',
        }),
    },
     methods: {
        ...mapActions([
            'users/loadUsers',
            'users/addFriend',
            'users/cancelInvitation',
            'users/acceptInvitation',
            'users/removeFriend',
            'users/denyInvitation'
        ]),
        processData(resp) {
            this.users = resp.data
            this.links = resp.links
            this.meta = resp.meta
        },
        onLoadPage(url) {
            this.requestApi(url)
            .then( resp => {
                this.processData(resp)
            })
        },
        onInviteFriend(userId) {
            this['users/addFriend'](userId)
        },
         onCancelInvitation(userId) {
             this['users/cancelInvitation'](userId)
         },
         onAcceptInvitation(userId) {
             this['users/acceptInvitation'](userId)
         },
         onRemoveFriend(userId) {
             this['users/removeFriend'](userId)
         },
         onDenyInvitation(userId) {
             this['users/denyInvitation'](userId)
         }
     }
}
</script>

<style scoped>

</style>
