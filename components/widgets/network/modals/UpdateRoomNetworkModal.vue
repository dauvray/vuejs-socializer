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
            <questionnaire-component
                ref="questionnaire"
                :editable="false"
                :questionnaireid="updateRoomId"
                :userid="me.id"
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
            }
        },
        data() {
            return {
                canValidate: false,
                updateRoomId: parseInt(process.env.MIX_FORMDESIGNER_CREATE_ROOM_ID)
            }
        },
        computed: {
            ...mapGetters({
                me: 'me/getMe',
            }),
        },
        methods: {
            onSaveModalChanges() {
                this.$refs.questionnaire.onValidQuestionnaire()
            },
            onHideModal() {
               this.$emit('hide-modal')
               this.canValidate = false
            },
            onDeportedValidation(isValid) {
                this.canValidate = isValid
            }
        }
    }

</script>
