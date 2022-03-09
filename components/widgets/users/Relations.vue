<template>
  <div class="card">
      <div class="card-header">
          <h3>Relations</h3>
          <small>{{total}} relations</small>
      </div>
      <div class="card-body">
          <ul class="list-group">
              <li v-for="(relation, idx) in relations"
                  class="list-group-item">
                  <author-widget
                      :key="`relation-${idx}`"
                      :author="relation"
                      :profileurl="profileurl"
                  ></author-widget>
              </li>
          </ul>
      </div>
      <div class="card-footer">
          <pagination-widget
              :items="relations"
              @loadPage="onLoadPage"
          ></pagination-widget>
      </div>
  </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: "Relations",
        components: {
            AuthorWidget: () => import('vuejs-estarter/components/widgets/Author'),
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
