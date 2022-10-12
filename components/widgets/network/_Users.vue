<template>
    <div>
        <h3>Abonnés</h3>
        <template v-if="network.users.length">
            <author-widget
                v-for="(user, idx) in network.users"
                :key="`user-${idx}`"
                :author="user"
                :profileurl="profileurl"
            ></author-widget>
        </template>
        <div v-else>Aucun abonné</div>
    </div>
</template>

<script>
    export default {
        name: "Users",
        components: {
            AuthorWidget: () => import('vuejs-estarter/components/widgets/Author'),
        },
        props: {
            network: {
                type: Object,
                required: true,
            },
            profileurl: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
