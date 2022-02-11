<template>
        <figure
            :id="selector">
            <filter-btn
                v-if="selector == 'self'"
                @apply-filter="onApplyFilter"
            ></filter-btn>
            <video
                ref="video"
                autoplay
                muted
                playsinline
                :poster="placeholder">
            </video>
            <figcaption>
                <img src="" />
                <span></span>
            </figcaption>
        </figure>
</template>

<script>
    export default {
        name: "WebcamPlayer",
        inject: ["eventBus"],
        components: {
            FilterBtn: () => import('vuejs-socializer/components/widgets/System/communication/webRTCWebcamComponent/WebcamFilterBtn')
        },
        props: {
            selector: {
                type: String,
                required: false,
                default: 'self'
            },
            placeholder: {
                type: String,
                required: true
            },
            self: {
                type: Object,
                required: true
            },
            peer: {
                type: Object,
                required: false,
            }
        },
        data() {
          return {}
        },
        created() {
            if(this.selector != 'self') {
                this.eventBus.$on('socializer-establish-features', this.establishCallFeatures)
                this.eventBus.$on('socializer-handle-rtc-peer-track', this.handleRTCPeerTRack)
                this.eventBus.$on('socializer-reset-peer', this.onResetPeer)
            }
        },
        mounted() {
            if(this.selector == 'self') {
                this.requestUserMedia(this.self.mediaConstraints)
            }
        },
        beforeDestroy() {
            this.displayStream(null)
        },
        methods: {
            async requestUserMedia(media_constraints) {
                this.self.stream = new MediaStream()
                this.self.media = await navigator.mediaDevices.getUserMedia(media_constraints)
                this.self.stream.addTrack(this.self.media.getTracks()[0])
                this.displayStream(this.self.stream)
            },
            displayStream(stream) {
                let video
                video = this.$refs.video
                video.srcObject = stream
            },
            establishCallFeatures(id) {
                console.log(`Establish webcam features for ${id}`)
                // media
                this.addStreamingMedia(id, this.self.stream)
            },
            addStreamingMedia(id, stream) {
                console.log(`Attemps to add streaming media to ${id}`)
                if (stream && this.peer) {
                    for (let track of stream.getTracks()) {
                        this.peer.connection.addTrack(track, stream)
                    }
                }
            },
            handleRTCPeerTRack(id, stream) {
                console.log(`RTC Peer track from ${id}`)
                if(this.peer && this.peer.id == id ){
                    this.displayStream(stream)
                }
            },
            onResetPeer(id) {
                if(this.peer && this.peer.id == id ) {
                    this.displayStream(null)
                }
            },
            onApplyFilter(filter){
                this.$refs['video'].className = filter
                this.$emit('apply-filter', filter)
            }
        }
    }
</script>

<style scoped>
    /* Video Effects */
    .filter-grayscale {
        filter: grayscale(100%);
    }
    .filter-sepia {
        filter: sepia(100%);
    }
    .filter-noir {
        filter: grayscale(100%) contrast(300%) brightness(60%);
    }
    .filter-psychedelic {
        filter: hue-rotate(180deg) saturate(400%) contrast(200%);
    }
</style>
