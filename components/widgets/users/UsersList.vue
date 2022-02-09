<template>
    <div>
        <notifications-widget></notifications-widget>
        <div v-for="(user, idx) in users"
        class="card mb-2"
        :key="idx">
            <div class="card-body p-2 d-flex align-items-center">
                <author-widget
                    class="flex-grow-1"
                    :author="user"
                    :profileurl="profileurl"
                ></author-widget>
                <users-communication
                    v-if="!user.is_me"
                    :user="user"
                ></users-communication>
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
        NotificationsWidget: () => import('vuejs-socializer/components/widgets/Notifications'),
        PaginationWidget: () => import('vuejs-estarter/components/widgets/Pagination'),
        GravatarStatus: () => import('vuejs-estarter/components/widgets/GravatarStatus'),
        AuthorWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Author'),
        UserLink: () => import('vuejs-eblogger/components/widgets/links/UserLink'),
        UsersBtn: () => import('./UsersBtn'),
        UsersCommunication: () => import('vuejs-socializer/components/widgets/users/UsersCommunication'),
    },
    props: {
        profileurl: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false,
            default: 'allNetworkUsers'
        }
    },
    data() {
        return {}
    },
    created() {
        switch(this.type) {
            case 'allNetworkUsers':
                this['users/loadNetworkUsers']()
                break
            case 'friendUsers':
                this['users/loadFriendUsers']()
                break
        }

    },
    computed: {
        ...mapGetters({
            users: 'users/getUsers',
        }),
    },
     methods: {
        ...mapActions([
            'users/loadNetworkUsers',
            'users/loadFriendUsers',
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
