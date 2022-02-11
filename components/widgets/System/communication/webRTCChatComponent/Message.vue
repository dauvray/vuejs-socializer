<template>
  <li class="chat-message" :data-timestamp="message.message.timestamp" :class="message.sender">
      <div class="info-wrapper">
          <span class="author">{{message.message.nickname}}</span>
          <span class="time">{{getTime}}</span>
      </div>
      <template v-if="message.image">
          <img :src="createURL" @load="onImgLoad"/>
      </template>
      <template v-else>
          <span class="message">{{message.message.text}}</span>
      </template>
  </li>
</template>

<script>
    export default {
        name: "Message",
        props: {
            message: {
                type: Object,
                required: true
            }
        },
        computed: {
            createURL: function() {
                return URL.createObjectURL(this.message.image)
            },
            getTime: function() {
                const date = new Date(this.message.message.timestamp * 1000)
                const pad = num => ("0" + num).slice(-2)
                let hours = date.getHours(),
                    minutes = date.getMinutes(),
                    seconds = date.getSeconds()
                return pad(hours) + ":" + pad(minutes)
            },
        },
        methods: {
            onImgLoad(event) {
                URL.revokeObjectURL(event.target.src)
                this.$emit('scroll-to-end')
            }
        }
    }
</script>

<style scoped>

</style>
