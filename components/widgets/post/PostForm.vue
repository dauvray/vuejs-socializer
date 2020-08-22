<template>
    <form @submit.prevent>

        <div class="form-group">
            <select id="target" class="form-control form-control-sm" v-model="selected">
                <option disabled value="">Qui peut voir votre post ?</option>
                <option value="1">Tous le monde</option>
                <option value="2">Relations uniquement</option>
            </select>
        </div>

        <div class="form-group">
            <textarea class="form-control"
                      v-model="postContent"
                      placeholder="De quoi souhaitez-vous discuter..." rows="3"
            ></textarea>
        </div>

        <button type="submit" class="btn btn-primary"
                :disabled="postContent.length >= 1 ? false : true"
                @click="onPublishPost">Publier</button>
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
        onPublishPost() {
            let formData = new FormData()
            formData.append('target', this.selected )
            formData.append('postContent', this.postContent )

            // is in vuejs-estarter framework ?
            if(typeof this.$estarterSettings === 'undefined') {
                axios.post('/publish-post', formData)
                    .then((response) => {

                    })
                    .catch((error) => {
                        alert(error);
                    });
            } else {
                this.$emit('onPublishPost', formData)
            }
        }
    }
}
</script>

<style scoped>

</style>
