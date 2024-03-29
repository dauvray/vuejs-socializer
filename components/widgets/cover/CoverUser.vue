<template>
    <div class="d-flex align-items-end p-3 cover-wrapper"
         :style="{backgroundImage: BackgroundImage, backgroundSize: backgroundSize}">
        <avatar-cropper
            v-if="editable"
            :size="size"
            :item="item"
             @onCroppedAvatar="onCroppedAvatar"
        ></avatar-cropper>
        <gravatar-status
            v-else
            class="float-left me-3"
            size="medium"
            :user="user"
        ></gravatar-status>
        <div class="me-2 pb-1 bg-opacity-dark-3">
            <h2 class="text-white m-0 p-2">{{ item.name }}</h2>
            <i class="text-white p-2">{{ item.function }}</i>
        </div>
        <a v-if="editable" class="mr-2 btn btn-primary" role="button"
           @click.prevent="editProfil" href="#">
            <i class="las la-pencil-alt"></i>
        </a>
        <div class="d-flex flex-grow-1 justify-content-end">
            <users-communication
                v-if="!user.is_me"
                :user="item"
                :webrtc="webrtc"
            ></users-communication>
            <users-btn v-if="!user.is_me"
                       :user="item"
                       @add-new-friend="onInviteFriend"
                       @cancel-new-invitation="onCancelInvitation"
                       @accept-new-invitation="onAcceptInvitation"
                       @remove-friend="onRemoveFriend"
                       @deny-invitation="onDenyInvitation"
            ></users-btn>
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
    import {mapActions, mapGetters} from 'vuex'
    export default {
        name: 'CoverUser',
        inject: ["eventBus"],
        components: {
            AvatarCropper: () => import('vuejs-estarter/components/widgets/AvatarCropper'),
            GravatarStatus: () => import('vuejs-estarter/components/widgets/Gravatar'),
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
            CropperWidget: () => import('vuejs-estarter/components/widgets/CropperWidget'),
            UsersBtn: () => import('vuejs-socializer/components/widgets/users/UsersBtn'),
            UsersCommunication: () => import('vuejs-socializer/components/widgets/users/UsersCommunication'),
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
            webrtc: {
                type: Boolean,
                required: false,
                default: false
            },
        },
        data() {
          return {
              file: null,
              backgroundSize: 'cover',
              canValidateCover: false
          }
        },
        created() {
           this.setUser(this.user)
        },
        computed: {
            ...mapGetters({
                item: 'users/getUser',
            }),
            BackgroundImage: function() {
                return `url(${this.coverUrl})`
            },
            coverUrl: function() {
                return this.item.cover
                    ? `/storage/users/${this.item.cover}`
                    : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            },
        },
        watch: {
            user: function (newValue, oldValue) {
                this.setUser(newValue)
            }
        },
        methods: {
            ...mapActions([
                'users/setUser',
                'users/addFriend',
                'users/cancelInvitation',
                'users/acceptInvitation',
                'users/removeFriend',
                'users/denyInvitation',
                'users/updateCover',
            ]),
            setUser(user) {
                this['users/setUser'](this.user)
            },
            onCroppedCover(file) {
                this.file = file
            },
            editProfil() {
                window.location = this.editroute
            },
            onSaveModalChanges() {
                let formData = new FormData()
                formData.append('file', this.file )
                this['users/updateCover'](formData)
                this.$emit('onCroppedCover', this.file)
            },
            onCroppedAvatar(file) {
                this.$emit('onCroppedAvatar', file)
            },
            onInviteFriend(userId) {
                this['users/addFriend'](userId)
            },
            onCancelInvitation(userId) {
                this['users/cancelInvitation'](userId)
            },
            onAcceptInvitation(userId) {
                this['users/acceptInvitation'](userId)
            },
            onRemoveFriend(userId) {
                this['users/removeFriend'](userId)
            },
            onDenyInvitation(userId) {
                this['users/denyInvitation'](userId)
            }
        }
    }
</script>

<style scoped>
    .cover-wrapper {
        border-radius: 0.25rem;
    }
</style>

