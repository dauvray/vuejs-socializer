<template>
    <div>
        <div v-for="(user, idx) in users"
        class="card mb-2"
        :key="idx"
        >
            <div class="card-body p-2 d-flex align-items-center">
                <div class="d-flex align-items-center flex-grow-1">
                    <gravatar-status :user="user"></gravatar-status>
                    <div class="d-flex flex-column">
                        <user-link :user="user"></user-link>
                        <small>{{ user.location }}</small>
                    </div>
                </div>
                <users-btn :user="user"></users-btn>
            </div>
        </div>

        <pagination-widget
            :items="users" 
            :links="links" 
            :meta="meta"
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
        UsersBtn: () => import('vuejs-socializer/components/widgets/users/UsersBtn'),
    },
    props: {
        type: {
            type: String,
            required: false,
            default: 'networksUsers'
        }
    },
    data() {
        return {}
    },
    created() {
        this['users/loadUsers'](this.type)
    },
    computed: {
         ...mapGetters({
             users: 'users/getUsers',
             links: 'users/getLinks',
             meta: 'users/getMeta',
         }),
    },
    methods: {
        ...mapActions([
            'users/loadUsers',
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
    }
}
</script>

<style scoped>

</style>
