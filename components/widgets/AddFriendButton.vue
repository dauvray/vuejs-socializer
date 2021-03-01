<template>
    <button type="button" :class="btnClass" @click="onSendAction">
        <i :class="btnIcon"></i> {{ btnLabel }}
    </button>
</template>

<script>
    export default {
        name: "AddFriendBtn",
        inject: ["eventBus"],
        props: {
            primaryurl: {
                type: String,
                required: true
            },
            secondaryurl: {
                type: String,
                required: false,
                default: ''
            },
            intermediateurl: {
                type: String,
                required: false,
                default: ''
            },
            // status principal : true / false
            status: {
                type: Boolean,
                required: false,
                default: false
            },
            // un status intermediaire peut etre utilisé
            secondarystatus: {
                type: Boolean,
                required: false,
                default: false
            },
            options: {
                type: Object,
                required: false,
                default: () => ({
                    btnLabel: {
                        primaryLabel: 'Ajouter',
                        secondaryLabel: 'Retirer',
                        intermediateLabel: 'Annuler invitation'
                    },
                    btnIcon: {
                        primaryIcon: 'lar la-plus-square',
                        secondaryIcon: 'las la-minus-circle',
                        intermediateIcon: 'las la-minus-circle'
                    },
                    btnClass: {
                        primaryClass: 'btn btn-primary btn-sm',
                        secondaryClass: 'btn btn-primary btn-sm',
                        intermediateClass: 'btn btn-primary btn-sm'
                    }
                })
            }
        },
        data() {
            return {
                localStatus: this.status,
                localSecondaryStatus: this.secondarystatus
            }
        },
        computed: {
            btnLabel() {
                return this.localSecondaryStatus
                    ? this.options.btnLabel.intermediateLabel
                    : this.localStatus
                        ? this.options.btnLabel.secondaryLabel
                        : this.options.btnLabel.primaryLabel
            },
            btnIcon() {
                return this.localSecondaryStatus
                    ? this.options.btnIcon.intermediateIcon
                    : this.localStatus
                        ? this.options.btnIcon.secondaryIcon
                        : this.options.btnIcon.primaryIcon
            },
            btnClass() {
                return this.localSecondaryStatus
                    ? this.options.btnClass.intermediateClass
                    : this.localStatus
                        ? this.options.btnClass.secondaryClass
                        : this.options.btnClass.primaryClass
            }
        },
        methods: {
            onSendAction() {
                axios({
                    url: this.localSecondaryStatus
                        ? this.intermediateurl
                        : this.localStatus
                            ? this.secondaryurl
                            : this.primaryurl,
                    method: 'get',
                }).then((response) => {
                    this.eventBus.$emit("httpSuccess", response.data.notification)
                    this.localSecondaryStatus = !this.localSecondaryStatus
                    this.localStatus = response.data.status
                }).catch( (error) => {
                    this.eventBus.$emit("httpError", error)
                })
            }
        }
    }
</script>

<style scoped>

</style>
