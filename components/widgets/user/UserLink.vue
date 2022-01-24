<template>
    <a :href="`/${profileurl}/${convertToSlug(user.name)}`">{{ user.name }}</a>
</template>

<script>

export default {
    name: 'UserLink',
    props: {
        user: {
            type: Object,
            required: true
        },
        profileurl: String
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
