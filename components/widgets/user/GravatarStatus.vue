<template>
    <div class="gravatar-wrapper">
        <gravatar-widget class="pr-2" :user="user" :size="size"></gravatar-widget>
        <i :class="{ 'text-success': user.is_online, 'text-danger': !user.is_online }" 
            class="status las la-dot-circle
        "></i>
    </div>
</template>

<script>

export default {
    'name': 'GravatarStatus',
        components: {
        GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        size: {
            type: String,
            required: false,
            default: 'small'
        }
    }
}
</script>

<style scoped>
    .gravatar-wrapper {
        position: relative;
        width: fit-content;
    }
    .status {
        position: absolute;
        right: 5px;
        bottom: 0px;
    }
</style>
