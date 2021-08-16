<template>
    <a :href="`/profile/${convertToSlug(user.name)}`">{{ user.name }}</a>
</template>

<script>

export default {
    name: 'UserLink',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        convertToSlug(text) {
            return text
                .toLowerCase()
                .replace(/ /g,'-')
                .replace(/[^\w-]+/g,'')
                ;
        },
    }
}
</script>
