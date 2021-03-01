<template>
    <div class="d-flex align-items-end p-3"
         :style="{backgroundImage: BackgroundImage, backgroundSize: backgroundSize}">
        <avatar-cropper
            v-if="editable"
            :size="size"
            :item="item"
             @onCroppedAvatar="onCroppedAvatar"
        ></avatar-cropper>
        <gravatar-widget v-else
            class="float-left pr-2"
            :user="user"
        ></gravatar-widget>
        <div class="mr-2 pb-1 bg-opacity-dark-3">
            <h2 class="text-white m-0 p-2">{{ item.name }}</h2>
            <i class="text-white p-2">{{ item.email }}</i>
        </div>
        <a v-if="editable" class="mr-2 btn btn-primary" role="button"
           @click.prevent="editProfil" href="#">
            <i class="las la-pencil-alt"></i>
        </a>
        <div class="flex-grow-1">
            <modal-widget
                v-if="editable"
                target="changecover"
                class="d-flex justify-content-end"
                :canValidate="canValidateCover"
                @saveModalChanges="onSaveModalChanges">
                <template #button>
                    <i class="las la-camera"></i>
                </template>
                <template #header>
                    Modifier couverture
                </template>
                <template #body>
                    <cropper-widget
                        ref="cropper"
                        stencil="cover"
                        :currentimage="coverUrl"
                        :canValidate="canValidateCover"
                        @canValidate="canValidateCover = true"
                        @onCroppedPicture="onCroppedCover"
                    ></cropper-widget>
                </template>
            </modal-widget>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'CoverUser',
        inject: ["eventBus"],
        components: {
            AvatarCropper: () => import('vuejs-estarter/components/widgets/AvatarCropper'),
            GravatarWidget: () => import('vuejs-estarter/components/widgets/Gravatar'),
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            CropperWidget: () => import('vuejs-estarter/components/widgets/CropperWidget'),
        },
        props: {
            user: {
                type: Object,
                required: true
            },
            size: {
                type: String,
                default: 'medium'
            },
            editroute: {
                type: String,
                required: false
            },
            editable: {
                type: Boolean,
                default: false
            },
        },
        data() {
          return {
              file: null,
              backgroundSize: 'cover',
              element: this.user,
              canValidateCover: false
          }
        },
        computed: {
            BackgroundImage: function() {
                return `url(${this.coverUrl})`
            },
            coverUrl: function() {
                return this.item.cover
                    ? `/storage/covers/${this.item.cover}`
                    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            },
            item: function() {
                return this.element
            }
        },
        watch: {
            user: function (newValue, oldValue) {
                this.element = newValue
            }
        },
        methods: {
            onCroppedCover(file) {
                this.file = file
            },
            editProfil() {
                window.location = this.editroute
            },
            onSaveModalChanges() {
                let formData = new FormData()
                formData.append('file', this.file )

                // is in vuejs-estarter framework ?
                if(typeof this.$estarterSettings === 'undefined') {
                    axios.post('/update-cover', formData)
                        .then((response) => {
                            this.element = response.data
                        })
                        .catch((error) => {
                            this.eventBus.$emit("httpError", 'Fichier non valide')
                        });
                } else {
                    this.$emit('onCroppedCover', this.file)
                }

                $('#changecover').modal('hide')
            },
            onCroppedAvatar(file) {
                this.$emit('onCroppedAvatar', file)
            }
        }
    }
</script>

