<template>
    <modal-widget
        v-if="showmodal"
        target="roomParams"
        class="d-flex justify-content-end"
        modalClasses="modal-xl"
        btnclass="btn btn-link"
        :canValidate="canValidate"
        :trigger="showmodal"
        :showBtn="false"
        @saveModalChanges="onSaveModalChanges"
        @hide="onHideModal"
    >
        <template #header>
            <i class="fas fa-cog"></i> Modifier un salon
        </template>
        <template #body>
            <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="onDeleteRoom"
                ><i class="las la-trash-alt"></i> Supprimer le salon</button>
            <questionnaire-component
                ref="questionnaire"
                :editable="false"
                :questionnaireid="updateRoomId"
                :userid="me.id"
                :payload="payload"
                :isstandalone="true"
                @deported-validation="onDeportedValidation"
            ></questionnaire-component>
        </template>
    </modal-widget>
</template>

<script >

    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'UpdateRoomNetworkModal',
        components: {
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
        },
        props: {
            showmodal: {
                type: Boolean,
                required: false,
                default: false,
            },
            payload: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                canValidate: false,
                updateRoomId: parseInt(process.env.MIX_FORMDESIGNER_UPDATE_ROOM_ID)
            }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
            }),
        },
        methods: {
            ...mapActions([
                'networks/updateRoom',
                'networks/deleteRoom',
            ]),
            onSaveModalChanges() {
                this.$refs.questionnaire.onValidQuestionnaire((response) => {
                    this['networks/updateRoom'](response)
                })
            },
            onHideModal() {
               this.$emit('hide-modal')
               this.canValidate = false
            },
            onDeportedValidation(isValid) {
                this.canValidate = isValid
            },
            onDeleteRoom() {
                if(confirm('Supprimer définitevement le salon')) {
                    this.showmodal = false
                    this['networks/deleteRoom'](this.payload.room_id)
                }
            }
        }
    }

</script>
