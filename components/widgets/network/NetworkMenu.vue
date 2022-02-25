<template>
    <ul class="nav nav-pills">
        <li class="nav-item">
            <a class="nav-link"
               :class="{active : CurrentComponent == 'AboutComponent'}"
               :href="void(0)"
               @click="onSelectedMenu('AboutComponent')"
            >A propos</a>
        </li>
        <li class="nav-item">
            <a class="nav-link"
               :href="void(0)"
               @click="onSelectedMenu('WallComponent')"
            >Mur</a>
        </li>
        <li class="nav-item">
            <a class="nav-link"
               :href="void(0)"
               :class="{active : CurrentComponent == 'UsersComponent'}"
               @click="onSelectedMenu('UsersComponent')"
            >Abonnés</a>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "NetworkMenu",
        props: {
            CurrentComponent: {
                type: String,
                required: true
            }
        },
        methods: {
            onSelectedMenu(component) {
                this.$emit('selected-component', component)
            }
        }
    }
</script>

<style scoped>

</style>
