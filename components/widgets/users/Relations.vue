<template>
  <div>
      <h3>Relations : {{total}}</h3>
        <author-widget
            v-for="(relation, idx) in relations"
            :key="`relation-${idx}`"
            :author="relation"
            :profileurl="profileurl"
        ></author-widget>
        <pagination-widget
          :items="relations"
          @loadPage="onLoadPage"
        ></pagination-widget>
  </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: "Relations",
        components: {
            AuthorWidget: () => import('vuejs-eblogger/components/widgets/Comment/widgets/Author'),
            PaginationWidget: () => import('vuejs-estarter/components/widgets/Pagination'),
        },
        props: {
            user: {
                type: Object,
                required: true
            },
            profileurl: {
                type: String,
                required: true
            }
        },
        computed: {
            ...mapGetters({
                relations: 'users/getUsers',
                total: 'users/getTotalUsers'
            }),
        },
        created() {
            this['users/loadFriendUsers'](this.user.slug)
        },
        methods: {
            ...mapActions([
                'users/loadFriendUsers',
            ]),
            onLoadPage(url) {
                // todo
            },
        }
    }
</script>

<style scoped>

</style>
