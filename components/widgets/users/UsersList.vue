<template>
    <div>
        <div v-for="(user, idx) in users" :key="idx">
            <gravatar-widget :user="user" size="small"></gravatar-widget>
            <a :href="`/profile/${convertToSlug(user.name)}`">{{ user.name }}</a>

            <button v-if="user.sended_invitation" 
                type="button"
                class="btn btn-link"
                @click="onAddFriend(user)"
            >Annuler invitation</button>
            <template v-else-if="user.received_invitation">
                <a class="btn btn-link"
                    :href="`/accept-friend-invitation/${user.id}`" 
                >Accepter invitation</a>
                <a class="btn btn-link"
                    :href="`/deny-friend-invitation/${user.id}`" 
                >Décliner invitation</a>
            </template>
            <button v-else
                type="button"
                class="btn btn-link"
                @click="onAddFriend(user.id)"
            >Inviter</button>
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

import {RestDataSourcesMixin} from 'vuejs-estarter/mixins/RestDataSourcesMixin'

export default {
    name: 'UsersList',
    mixins: [
        RestDataSourcesMixin
    ],
    components: {
        PaginationWidget: () => import('vuejs-estarter/components/widgets/Pagination'),
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
    },
    props: {
        type: {
            type: String,
            required: false,
            default: 'networksUsers'
        }
    },
    data() {
        return {
            users: [],
            links: {},
            meta: {},
            urls: {
                networksUsers: { 
                    api : '/networks/users/list'
                },
                friendRequests: {
                    api: '/my-community/list'
                }
            },
            listKey: 0,
        }
    },
    created() {
        this.requestApi(this.urls[this.type].api)
        .then(resp => {
            this.processData(resp)
        })
    },
    methods: {
        processData(resp) {
            this.users = resp.data
            this.links = resp.links
            this.meta = resp.meta
        },
        convertToSlug(text) {
            return text
                .toLowerCase()
                .replace(/ /g,'-')
                .replace(/[^\w-]+/g,'')
                ;
        },
        onLoadPage(url) {
            this.requestApi(url)
            .then( resp => {
                this.processData(resp)
            })
        },
        onAddFriend(user) {
            this.requestApi(
                `/add-friend/${user.id}`, 
                'get', 
                null, 
                {
                    'msg': 'Invitation envoyée',
                    'err': 'Erreur : Invitation impossible'
                }
            )
            .then( resp => {

            })
        }
    }
}
</script>

<style scoped>

</style>
