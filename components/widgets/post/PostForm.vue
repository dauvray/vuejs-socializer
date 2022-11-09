<template>
    <form @submit.prevent>
        <div class="form-group">
            <select id="target" class="form-control form-control-sm" v-model="selected">
                <option disabled selected value="">Qui peut voir votre post ?</option>
                <option value="1">Tous le monde</option>
                <option value="2">Relations uniquement</option>
               <!--  <option v-if="type == 'wall'" value="3">Que nous deux</option> -->
            </select>
        </div>
        <div class="form-group">
            <textarea
                class="form-control"
                v-model="postContent"
                placeholder="De quoi souhaitez-vous discuter..." rows="3"
            ></textarea>
        </div>
    </form>
</template>

<script>
    export default {
        name: "PostForm",
        props: {
/*             type: {
                type: String,
                required: true,
            } */
        },
        data() {
            return {
                selection: '',
                content: '',
            }
        },
        computed: {
            postContent: {
                get() {
                    return this.content
                },
                set(value) {
                    this.$emit('change-post-content', value)
                }
            },
            selected: {
                get() {
                    return this.selection
                },
                set(value) {
                    this.$emit('change-post-target', value)
                }
            }
        },
    }
</script>

<style scoped>

</style>
