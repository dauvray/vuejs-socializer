<template>
    <div id="interface">
        <header id="header">
            <h1 class="preserve-access">Welcome</h1>
            <button class="join"
                    type="button"
                    id="call-button"
                    @click="handleCallButton"
            >Leave Call</button>
        </header>

        <webcams-component
            :self="self"
            :peers="peers"
            @create-data-channel="onCreateDataChannel"
        ></webcams-component>

        <chat-component
            :peers="peers"
            :self="self"
            @create-data-channel="onCreateDataChannel"
        ></chat-component>

    </div>
</template>

<script>

    export default {
        name: "WebRTCWrapper",
        inject: ["eventBus"],
        components: {
            WebcamsComponent: () => import('vuejs-socializer/components/widgets/System/communication/WebcamsComponent'),
            ChatComponent: () => import('vuejs-socializer/components/widgets/System/communication/WebRTCChatComponent')
        },
        props: {
            notification: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                self: {
                    rtcConfig: null,
                    mediaConstraints: { audio: false, video: true },
                    features: {},
                    me: null,
                },
                peers: {},
                namespace: null,
                sc: null,
            }
        },
        created() {
            this.eventBus.$on('here-i-am', (user) => {this.self.me = user})
            this.namespace = this.notification.notification.data.room
            this.sc = io.connect(process.env.MIX_NODEJS_SERVER + '/' + this.namespace, { autoConnect: false })
            this.eventBus.$emit('who-am-i')
            this.registerScCallbacks()
        },
        mounted() {
            setTimeout(() => {this.joinCall()}, 1000)
        },
        beforeDestroy() {
            this.leaveCall()
        },
        methods: {
            onHideModal() {
                this.$emit('hide-modal')
            },
            /**
             *  User-Interface Functions and Callbacks
             */
            // join & leave
            handleCallButton(event) {
                this.leaveCall()
            },
            joinCall() {
                this.sc.open()
            },
            leaveCall() {
                this.sc.close()
                for (let id in this.peers) {
                    this.resetPeer(id)
                }
                this.onHideModal()
            },

            // the available features for each peers
            addFeaturesChannel(id) {
                const peer = this.peers[id];
                peer.featuresChannel = peer.connection.createDataChannel(
                    'features',
                    { negotiated: true, id: 60 }
                );

                peer.featuresChannel.onopen = (event) => {
                    this.self.features.binaryType = peer.featuresChannel.binaryType
                    // Other feature-detection logic could go here...
                    peer.featuresChannel.send(JSON.stringify(this.self.features))
                }

                peer.featuresChannel.onmessage = (event) => {
                    peer.features = JSON.parse(event.data)
                }
            },

            /**
             *  Call Features & Reset Functions
             */
            establishCallFeatures(id) {
                this.registerRtcCallbacks(id)

                this.addFeaturesChannel(id)
                // all RTCcomponents listens this event to add features
                this.eventBus.$emit('socializer-establish-features', id)
            },
            resetPeer(id, preserve = false) {
                const peer = this.peers[id]
                peer.connection.close()
                this.eventBus.$emit('socializer-reset-peer', id, preserve)
                if (!preserve) {
                    delete this.peers[id]
                }
            },

            /**
             *  WebRTC Functions and Callbacks
             */
            registerRtcCallbacks(id) {
                const peer = this.peers[id]
                peer.connection.onconnectionstatechange = this.handleRtcConnectionStateChange(id)
                peer.connection.onnegotiationneeded = this.handleRtcConnectionNegotiation(id)
                peer.connection.onicecandidate = this.handleRtcIceCandidate(id)
                peer.connection.ontrack = this.handleRtcPeerTrack(id)
                peer.connection.ondatachannel = this.handleRTCDataChannel(id)
            },
            handleRtcPeerTrack(id) {
                return ({ track, streams: [stream] }) => {
                    console.log(`Attempt to display media from peer ID: ${id}`)
                    this.eventBus.$emit('socializer-handle-rtc-peer-track', `#peer-${id}`, stream)
                }
            },
            /**
             * =========================================================================
             *  End Application-Specific Code
             * =========================================================================
             */

            /**
             *  Reusable WebRTC Functions and Callbacks
             */
            handleRtcConnectionNegotiation(id) {
                return async () => {
                    const peer = this.peers[id]
                    const selfState = peer.selfStates
                    if (selfState.isSuppressingInitialOffer) return
                    try {
                        selfState.isMakingOffer = true
                        console.log('Attempting to make an offer...')
                        await peer.connection.setLocalDescription()
                    } catch(e) {
                        const offer = await peer.connection.createOffer()
                        await peer.connection.setLocalDescription(offer)
                    } finally {
                        this.sc.emit('signal',
                            {
                                to: id,
                                from: this.self.id,
                                signal: { description: peer.connection.localDescription }
                            })
                        selfState.isMakingOffer = false
                    }
                }
            },
            handleRtcIceCandidate(id) {
                return ({ candidate }) => {
                    this.sc.emit('signal', { to: id, from: this.self.id, signal: { candidate } })
                }
            },
            handleRtcConnectionStateChange(id) {
                return () => {
                    const peer = this.peers[id]
                    const connectionState = peer.connection.connectionState
                    // Assume *some* element will take a unique peer ID
                    const peerElement = document.querySelector(`#peer-${id}`)
                    if (peerElement) {
                        peerElement.dataset.connectionState = connectionState
                    }
                    console.log(`Connection state '${connectionState}' for Peer ID: ${id}`)
                }
            },
            handleRTCDataChannel(id) {
                return ({ channel }) => {
                    const label = channel.label
                    console.log(`Data channel added for ${label}`)
                    this.eventBus.$emit('socializer-handle-rtc-data-channel', {id, channel})
                    console.log(`Opened ${channel.label} channel with an ID of ${channel.id}`)
                }
            },

            /**
             *  Signaling-Channel Functions and Callbacks
             */
            registerScCallbacks() {
                this.sc.on('connect', this.handleScConnect)
                this.sc.on('connected peers', this.handleScConnectedPeers)
                this.sc.on('connected peer', this.handleScConnectedPeer)
                this.sc.on('disconnected peer', this.handleScDisconnectedPeer)
                this.sc.on('signal', this.handleScSignal)
            },
            handleScConnect() {
                console.log('Successfully connected to the signaling server!')
                this.self.id = this.sc.id
                console.log(`Self ID: ${this.self.id}`)
            },
            handleScConnectedPeers(ids) {
                console.log(`Connected peer IDs: ${ids.join(', ')}`)
                for (let id of ids) {
                    if (id !== this.self.id) {
                        // be polite with already-connected peers
                        this.initializePeer(id, true)
                        this.establishCallFeatures(id)
                    }
                }
            },
            handleScConnectedPeer(id) {
                console.log(`Newly connected peer ID: ${id}`)
                // be impolite with each newly connecting peer
                this.initializePeer(id, false)
                this.establishCallFeatures(id)
            },
            handleScDisconnectedPeer(id) {
                console.log(`Disconnected peer ID: ${id}`)
                this.resetPeer(id)
            },
            async handleScSignal({ from, signal: { candidate, description } }) {
                const id = from
                const peer = this.peers[id]
                const selfState = peer.selfStates

                if (description) {

                    if (description.type === '_reset') {
                        console.log(`***** Received a signal to reset from peer ID: ${id}`);
                        this.resetAndRetryConnection(id)
                        return;
                    }

                    const readyForOffer =
                        !selfState.isMakingOffer &&
                        (peer.connection.signalingState === 'stable'
                            || selfState.isSettingRemoteAnswerPending)
                    const offerCollision = description.type === 'offer' && !readyForOffer
                    selfState.isIgnoringOffer = !selfState.isPolite && offerCollision
                    if (selfState.isIgnoringOffer) {
                        return
                    }

                    selfState.isSettingRemoteAnswerPending = description.type === 'answer'

                    try {
                        console.log('Signaling state on incoming description:', peer.connection.signalingState)
                        await peer.connection.setRemoteDescription(description)
                    } catch(e) {
                        console.log(`***** Resetting and signaling same to peer ID: ${id}`)
                        this.resetAndRetryConnection(id)
                        return
                    }

                    selfState.isSettingRemoteAnswerPending = false

                    if (description.type === 'offer') {
                        try {
                            await peer.connection.setLocalDescription()
                        } catch(e) {
                            const answer = await peer.connection.createAnswer()
                            await peer.connection.setLocalDescription(answer)
                        } finally {
                            this.sc.emit('signal', {
                                to: id,
                                from: this.self.id,
                                signal: {
                                    description: peer.connection.localDescription
                                }
                            })
                            selfState.isSuppressingInitialOffer = false
                        }
                    }

                } else if (candidate) {
                    // Handle ICE candidates
                    try {
                        await peer.connection.addIceCandidate(candidate)
                    } catch(e) {
                        // Log error unless state is ignoring offers
                        // and candidate is not an empty string
                        if (!selfState.isIgnoringOffer && candidate.candidate.length > 1) {
                            console.error(`Unable to add ICE candidate for peer ID: ${id}.`, e)
                        }
                    }
                }
            },
            resetAndRetryConnection(id) {
                const polite = this.peers[id].selfStates.isPolite
                this.resetPeer(id, true)
                this.initializePeer(id, polite)
                this.peers[id].selfStates.isSuppressingInitialOffer = polite
                this.establishCallFeatures(id)
                if (polite) {
                    this.sc.emit('signal',
                        {
                            to: id,
                            from: this.self.id,
                            signal: {
                                description: {
                                    type: '_reset'
                                }
                            }
                        })
                }
            },
            initializePeer(id, polite) {
                this.peers[id] = {
                    connection: new RTCPeerConnection(this.self.rtcConfig),
                    selfStates: {
                        isPolite: polite,
                        isMakingOffer: false,
                        isIgnoringOffer: false,
                        isSettingRemoteAnswerPending: false,
                        isSuppressingInitialOffer: false
                    }
                }
            },
            onCreateDataChannel(options) {
                const peer = this.peers[options.peerId]
                peer[options.channel] = peer.connection.createDataChannel(
                    options.label,
                    options.config || null
                )
                peer[options.channel].onmessage = options.onmessage || null
                peer[options.channel].onclose = options.onclose || null
                peer[options.channel].onopen = options.onopen || null
            },

            // A placer ailleurs
            prepareNamespace(hash, set_location) {
                let ns = hash.replace(/^#/, ''); // remove # from the hash
                if (/^[a-z]{4}-[a-z]{4}-[a-z]{4}$/.test(ns)) {
                    console.log('Checked existing namespace', ns);
                    return ns;
                }
                ns = this.generateRandomAlphaString('-', 4, 4, 4);
                console.log('Created new namespace', ns);
                if (set_location) window.location.hash = ns;
                return ns;
            },
            generateRandomAlphaString(separator, ...groups) {
                const alphabet = 'abcdefghijklmnopqrstuvwxyz';
                let ns = [];
                for (let group of groups) {
                    let str = '';
                    for (let i = 0; i < group; i++) {
                        str += alphabet[Math.floor(Math.random() * alphabet.length)];
                    }
                    ns.push(str);
                }
                return ns.join(separator);
            },
            resetObjectKeys(obj) {
                for (let key of Object.keys(obj)) {
                    delete obj[key];
                }
            },
        }
    }
</script>

<style >
#interface {
    height: 100vh; /* TODO: Enhance with JS for mobile */
    padding: 22px;
    display: grid;
    grid-gap: 11px;
    grid-template-rows: auto auto 1fr; /* heading videos chatbox */
}
#header {
    /* Can discard this selector; superseded by grid-gap. */
    /*margin-bottom: 11px;*/
}
#header > h1 {
    margin-bottom: 11px;
}

/* Controls */

button {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    cursor: pointer;
    /* Box Styles */
    display: block;
    border: 0;
    border-radius: 3px;
    padding: 11px;
}
.join {
    background-color: green;
    color: white;
}
.leave {
    background-color: #CA0;
    color: black;
}
#call-button {
    width: 143px; /* 6.5 typographic grid lines */
    margin-right: 11px;
}

/* Video Elements */

video {
    background-color: #DDD;
    display: block;
    max-width: 100%;
}
#videos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, max-content));
    gap: 11px;
}

figure {
    position: relative;
}
figcaption {
    color: #EEE;
    background: rgba(16,16,16,0.6);
    font-weight: normal;
    font-size: 14px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 5.5px;
}
figcaption form {
    display: flex;
    flex-flow: row wrap;
    gap: 5.5px;
}
figcaption form > * {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    flex: 1 0 auto;
}
#username-input {
    background-color: inherit;
    border: 1px solid #CCC;
    color: #EEE;
    display: block;
    padding: 5.5px;
    max-width: 100%;
}
#username-set-btn {
    background: rgba(64,64,64,0.8);
    color: #EEE;
    padding: 5.5px;
}

#self {
    width: 30%;
    position: absolute;
    left: 11px;
    z-index: 1000; /* Prevent remote filters from hiding #self */
    border: 1px solid #CCC;
}

.connected #self {
    cursor: pointer;
}

#chat {
    height: 100%;
    min-height: 220px; /* Accomodate small, squarish screens */
    border: 1px solid #999;
    padding: 5.5px;
    display: flex; /* Use columnar flexbox to constrain log */
    flex-direction: column;
    font-weight: normal;
}
#chat-log {
    flex-grow: 1;
    overflow: auto;
    padding-bottom: 11px;
    margin-bottom: 5.5px;
    min-height: 0; /* Firefox fix */
}
#chat-form {
    flex-grow: 0;
    display: flex;
}
#chat-log li {
    border-radius: 5.5px;
    padding: 5.5px;
    margin-bottom: 5.5px;
    max-width: 60%;
    clear: both;
    overflow: hidden;
}
#chat-log .peer {
    background: #EEE;
    float: left;
}
#chat-log .self {
    background: #009;
    color: #EEE;
    opacity: 0.3;
    float: right;
}
#chat-log .self.received {
    opacity: 1.0;
}
#chat-log .self.received.delayed {
    transition: opacity 0.4s;
}
#chat-form button {
    cursor: pointer;
    flex: 0 0 auto;
    background: #009;
    color: #EEE;
}
#chat-form #chat-img-btn {
    background: #EEE;
    color: #000;
    margin-right: 5.5px;
}
#chat-form input {
    flex: 1 1 100%;
    padding: 9px;
    margin-right: 5.5px;
    border: 2px solid #999;
    outline: 0;
}
#chat-log .img {
    padding: 0;
}


/* Video Effects
 blur()
brightness()
contrast()
drop-shadow()
grayscale()
hue-rotate()
invert()
opacity()
saturate()
sepia()

 */

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

/* Media Queries */
@media screen and (min-width: 500px) {
    #header {
        display: flex;
        flex-direction: row-reverse;
        align-items: baseline;
        justify-content: flex-end;
    }
    #header > * {
        flex: 0 0 auto;
    }
    #header > h1 {
        margin-bottom: 0;
    }
}

@media screen and (min-width: 680px) {
    #interface {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr;
    }
    #header {
        grid-column: 1 / 3;
    }
}
</style>
