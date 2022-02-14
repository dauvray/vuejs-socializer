<template>
    <article
        id="videos"
        ref="videos">
        <h2 class="preserve-access">Streaming Videos</h2>

        <stream-widget
            selector="self"
            :self="self"
            @apply-filter="handleSelfFilterVideo"
        ></stream-widget>

        <stream-widget
            v-for="(peer, idx) in peers"
            :key="idx"
            :selector="`peer-${peer.id}`"
            :peer="peer"
            :self="self"
        ></stream-widget>
    </article>
</template>

<script>

    export default {
        name: "WebcamsComponent",
        inject: ["eventBus"],
        components: {
           StreamWidget: () => import('vuejs-socializer/components/widgets/System/communication/webRTCWebcamComponent/StreamPlayer')
        },
        props: {
            peers: {
                type: Array,
                required: true,
            },
            self: {
                type: Object,
                required: true
            },
        },
        data() {
            return {

            }
        },
        created() {
            this.eventBus.$on('socializer-establish-features', this.establishCallFeatures)
            this.eventBus.$on('socializer-handle-rtc-data-channel', this.handleRTCDataChannel)
        },
        beforeDestroy() {
            const stream = this.self.stream
            const tracks = stream.getTracks()
            tracks.forEach(function(track) {
                track.stop()
            })
            this.self.stream.srcObject = null
        },
        methods: {
            getPeer(id) {
                let wanted
                this.peers.forEach(peer => {
                    if(peer.id == id) {
                        wanted = peer
                    }
                })
                return wanted
            },
            /**
             *  WebRTC Functions and Callbacks
             */
            establishCallFeatures(id) {
                // share self infos
                this.shareUsername(this.self.me.name, id)
                this.shareUseravatar(this.self.me.image, id)
            },
            // obj = {id, channel }
            handleRTCDataChannel(obj) {
                const label = obj.channel.label

                if (label.startsWith('username-')) {
                    document.querySelector(`#peer-${obj.id} figcaption span`).innerText = label.split('username-')[1]
                    obj.channel.onopen = () => {
                        obj.channel.close()
                    }
                }

                if (label.startsWith('avatar-')) {
                    document.querySelector(`#peer-${obj.id} figcaption img`).src = `/storage/users/${label.split('avatar-')[1]}.small.jpg`
                    obj.channel.onopen = () => {
                        obj.channel.close()
                    }
                }

                if (label.startsWith('filter-')) {
                    document.querySelector(`#peer-${obj.id}-video-wrapper`).className = label
                    obj.channel.onopen = () => {
                        obj.channel.close()
                    }
                }
            },
            // Vidéo filter
            handleSelfFilterVideo(filter) {
                this.peers.forEach(peer => {
                    if (peer.connection.connectionState === 'connected'){
                        this.$emit('create-data-channel', {
                            peerId: peer.id,
                            label: filter,
                            channel: 'filterChannel',
                            onclose: () => {console.log(`Remote peer ${peer.id} has closed the ${filter} data channel`)}
                        })
                    }
                })
            },
            shareUserFilter(id, filter) {
                console.log(`Attempt to send filter to peer ID: ${id}`)
                const peer = this.getPeer(id)
                if (peer.connection.connectionState !== 'connected') return
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: filter,
                    channel: 'filterChannel',
                    onclose: () => {console.log(`Remote peer ${id} has closed the ${filter} data channel`)}
                })
            },
            // User name
            shareUsername(username, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.getPeer(id)
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: `username-${username}`,
                    channel: 'usernameChannel',
                    onclose: () => {console.log(`Remote peer ${id} has closed the usernameChannel data channel`)}
                })
            },
            shareUseravatar(icon, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.getPeer(id)
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: `avatar-${icon}`,
                    channel: 'avatarChannel',
                    onclose: () => {console.log(`Remote peer ${id} has closed the avatarChannel data channel`)}
                })
            },
        }
    }
</script>

<style scoped>

</style>
