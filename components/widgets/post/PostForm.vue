<template>
    <form @submit.prevent>
        <div class="form-group">
            <select id="target" ref="target" class="form-control form-control-sm" v-model="selected">
                <option disabled value="">Qui peut voir votre post ?</option>
                <option value="1">Tous le monde</option>
                <option value="2">Relations uniquement</option>
            </select>
        </div>
        <div class="form-group">
            <textarea class="form-control" ref="content"
                      v-model="postContent"
                      placeholder="De quoi souhaitez-vous discuter..." rows="3"
            ></textarea>
        </div>
    </form>
</template>

<script>
    export default {
        name: "PostForm",
        data() {
            return {
                postContent: '',
                selected: ''
            }
        },
        methods: {
            // get form values ( via parent )
            getPostFormContent() {
                let formData = new FormData()
                formData.append('target', this.$refs.target.value )
                formData.append('postContent', this.$refs.content.value )
                return formData
            }
        }
    }
</script>

<style scoped>

</style>
