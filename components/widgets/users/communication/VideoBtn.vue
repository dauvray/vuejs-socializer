<template>
    <div>
        <button
            v-if="user.is_online"
            type="button"
            class="btn btn-primary btn-sm"
            @click="onRequestCall"
        ><i class="las la-video"></i>
        </button>

        <modal-widget
            v-if="showModal"
            target="videoCall"
            class="d-flex justify-content-end"
            modalClasses="modal-fullscreen"
            btnclass="btn btn-link"
            :trigger="showModal"
            :backdrop="'static'"
            :keyboard="false"
            :showBtn="false"
            :closebutton="false"
            @hide="onHideModal">
                <template #header>
                    <i class="fas fa-cog"></i> Appel Vidéo
                </template>
                <template #body>
                    <component
                        v-bind:is="currentModalComponent"
                        :user="user"
                        :notification="sendedNotification"
                        @cancel-call="onCancelCall"
                        @accepted-call="onAcceptedCall"
                        @hide-modal="onHideModal"
                    ></component>
                </template>
                <template #footer>
                    {{''}}
                </template>
        </modal-widget>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import WebRTCMixin from 'vuejs-socializer/components/widgets/System/communication/mixins/WebRTCMixin'

export default {
    name: "VideoBtn",
    mixins: [
        WebRTCMixin
    ],
    components: {
        ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
        WebRtcWrapper: () => import('vuejs-socializer/components/widgets/System/communication/WebRTCWrapper'),
        VideoCallInvitation: () => import('vuejs-socializer/components/widgets/System/communication/VideoCallInvitationModal'),
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
      return {
        showModal: false,
        currentModalComponent: null,
        sendedNotification: null
      }
    },
    methods: {
        ...mapActions([
            'notifications/pushNotification',
            'notifications/deleteNotification',
        ]),
        onRequestCall() {

            // check permissions
            navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then((stream) => {

                this.stopBothVideoAndAudio(stream)

                this['notifications/pushNotification']({
                    to: this.user.id,
                    data: {
                        type: 'video_call_invitation',
                        room: this.generateRandomAlphaString('-', 4, 4, 4)
                    }
                })
                .then((notification) => {
                    this.currentModalComponent = 'VideoCallInvitation'
                    this.showModal = true
                    this.sendedNotification = notification
                }) 

            })
            .catch((err) => {
               //
            });
        },
        onHideModal() {
            this.showModal = false
        },
        onCancelCall() {
            this['notifications/deleteNotification'](this.sendedNotification.id)
            .then(() => {
                this.showModal = false
                this.sendedNotification = null
            })
        },
        onAcceptedCall() {
            this.currentModalComponent = 'WebRtcWrapper'
        }
    }
}
</script>

<style scoped>

</style>
