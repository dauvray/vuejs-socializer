<template>
    <span class="badge rounded-pill" :class="classObject">{{statusLabel}}</span>
</template>

<script>
    export default {
        name: "PostTarget",
        props: {
            target: {
                type: [Number, String],
                required: true
            }
        },
        computed: {
            classObject: function () {
                return {
                    'bg-success': this.target == 1,
                    'bg-warning': this.target == 2,
                    'bg-danger': this.target == 3,
                }
            },
            statusLabel: function() {
                switch(this.target) {
                    case 1:
                        return 'Publique'
                        break
                    case 2:
                        return 'Restreint'
                        break
                    case 3:
                        return 'Privé'
                        break
                }
            }
        }
    }
</script>

<style scoped>

</style>
