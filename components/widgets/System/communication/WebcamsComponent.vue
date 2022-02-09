<template>
    <article
        id="videos"
        ref="videos">
        <h2 class="preserve-access">Streaming Videos</h2>
        <figure
            id="self"
            ref="self"
            @click="handleSelfVideo">
            <video
                autoplay
                muted
                playsinline
                :poster="placeholder">
            </video>
        </figure>
    </article>
</template>

<script>

    export default {
        name: "WebcamsComponent",
        inject: ["eventBus"],
        props: {
            peers: {
                type: Object,
                required: true,
            },
            self: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                placeholder: '/images/vendor/socializer/placeholder.png',
                filters: ['grayscale', 'sepia', 'noir', 'psychedelic', 'none'],
                peer: null,
            }
        },
        created() {
            this.eventBus.$on('socializer-establish-features', this.establishCallFeatures)
            this.eventBus.$on('socializer-handle-rtc-data-channel', this.handleRTCDataChannel)
            this.eventBus.$on('socializer-handle-rtc-peer-track', this.handleRTCPeerTRack)
            this.eventBus.$emit('socializer-reset-peer', this.onResetPeer)
            this.requestUserMedia(this.self.mediaConstraints)
        },
        beforeDestroy() {
            const stream = this.self.stream
            const tracks = stream.getTracks()
            tracks.forEach(function(track) {
                track.stop();
            })
            this.self.stream.srcObject = null
        },
        methods: {
            /**
             *  WebRTC Functions and Callbacks
             */
            establishCallFeatures(id) {
                // media
                this.addStreamingMedia(id, this.self.stream)
                // share self infos
                if (this.self.me) {
                    this.shareUsername(this.self.me.name, id)
                    this.shareUseravatar(this.self.me.image, id)
                }
            },
            addStreamingMedia(id, stream) {
                this.peer = this.peers[id]
                if (stream) {
                    for (let track of stream.getTracks()) {
                        this.peer.connection.addTrack(track, stream)
                    }
                }
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
                    document.querySelector(`#peer-${obj.id}`).className = label
                    obj.channel.onopen = () => {
                        obj.channel.close()
                    }
                }
            },
            handleRTCPeerTRack(selector, stream) {
                this.displayStream(selector, stream)
            },
            async requestUserMedia(media_constraints) {
                this.self.stream = new MediaStream();
                this.self.media = await navigator.mediaDevices.getUserMedia(media_constraints);
                this.self.stream.addTrack(this.self.media.getTracks()[0]);
                this.displayStream('self', this.self.stream);
            },
            // Vidéo filter
            handleSelfVideo(event) {
                const filter = `filter-${this.cycleFilter()}`
                for (let id in this.peers) {
                    this.shareUserFilter(id, filter)
                }
                event.target.className = filter
            },
            shareUserFilter(id, filter) {
                const peer = this.peers[id];
                if (peer.connection.connectionState !== 'connected') return
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: filter,
                    onclose: () => {console.log(`Remote peer ${id} has closed the ${filter} data channel`)}
                })
            },
            // User name
            shareUsername(username, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.peers[id]
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: `username-${username}`
                })
            },
            shareUseravatar(icon, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.peers[id]
                this.$emit('create-data-channel', {
                    peerId: id,
                    label: `avatar-${icon}`
                })
            },
            createVideoElement(id) {
                const figure = document.createElement('figure')
                const figcaption = document.createElement('figcaption')
                const video = document.createElement('video')
                const icon = document.createElement('img')
                const nickname = document.createElement('span')
                const videoAttributes = {
                    autoplay: '',
                    playsinline: '',
                    poster: this.placeholder
                }
                const iconAttributes = {
                    src: this.placeholder
                }
                // Set attributes
                figure.id = `peer-${id}`
                for (let attr in iconAttributes) {
                    icon.setAttribute(attr, iconAttributes[attr])
                }
                figcaption.appendChild(icon)
                figcaption.appendChild(nickname)
                // figcaption.innerText = id

                for (let attr in videoAttributes) {
                    video.setAttribute(attr, videoAttributes[attr])
                }
                // Append the video and figcaption elements
                figure.appendChild(video)
                figure.appendChild(figcaption)
                // Return the complete figure
                return figure
            },
            displayStream(selector, stream) {
                let videoElement = this.$refs[selector]
                let video
                if (!videoElement) {
                    const id = selector.replace(/^#peer-/, ''); // remove `#peer-` portion
                    const videos = this.$refs.videos
                    videoElement = this.createVideoElement(id);
                    videos.appendChild(videoElement);
                }
                video = videoElement.querySelector('video')
                video.srcObject = stream
            },
            onResetPeer(id, preserve) {
                const videoElement = `#peer-${id}`
                this.displayStream(videoElement, null)
                if (!preserve) {
                    document.querySelector(videoElement).remove()
                }
            },
            cycleFilter() {
                const filter = this.filters.shift()
                this.filters.push(filter)
                return filter
            }
        }
    }
</script>

<style scoped>

</style>
