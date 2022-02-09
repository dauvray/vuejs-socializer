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

        <aside id="chat">
            <h2 class="preserve-access">Text Chat</h2>
            <ol id="chat-log"></ol>
            <form id="chat-form" action="#null" v-on:submit.prevent="handleMessageForm">
                <label for="chat-msg" class="preserve-access">Compose Message</label>
                <input type="text" id="chat-msg" name="chat-msg" autocomplete="off" />
                <label for="chat-img-btn" class="preserve-access" >Send Image</label>
                <button type="button" id="chat-img-btn" @click="handleImageButton">Image</button>
                <button type="submit" id="chat-btn">Send</button>
            </form>
        </aside>
    </div>
</template>

<script>

    const VideoFX = class {
        constructor() {
            this.filters = ['grayscale', 'sepia', 'noir', 'psychedelic', 'none'];
        }
        cycleFilter() {
            const filter = this.filters.shift();
            this.filters.push(filter);
            return filter;
        }
    }

    export default {
        name: "MultiVideoPeerModal",
        inject: ["eventBus"],
        components: {
            ModalWidget: () => import('vuejs-estarter/components/widgets/Modal'),
        },
        props: {
            notification: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                me: null,
                self: {
                    rtcConfig: null,
                    mediaConstraints: { audio: false, video: true },
                    filters: new VideoFX(),
                    messageQueue: [],
                    features: {},
                },
                peers: new Map(),
                namespace: null,
                sc: null,
                placeholder: '/images/vendor/socializer/placeholder.png'
            }
        },
        created() {
            this.eventBus.$on('here-i-am', (user) => {this.me = user})
            this.namespace = this.notification.notification.data.room
            this.sc = io.connect('https://127.0.0.1:3000/' + this.namespace, { autoConnect: false }) // todo url a mettre dans le .env
            this.eventBus.$emit('who-am-i')
            this.registerScCallbacks()
            this.requestUserMedia(this.self.mediaConstraints)
        },
        mounted() {
            setTimeout(() => {this.joinCall()}, 1000)
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
                for (let id of this.peers.keys()) {
                    this.resetPeer(id)
                }
                this.onHideModal()
            },
            // Vidéo filter
            handleSelfVideo(event) {
                const filter = `filter-${this.self.filters.cycleFilter()}`
                for (let id of this.peers.keys()) {
                    this.shareUserFilter(id, filter)
                }
                event.target.className = filter
            },
            shareUserFilter(id, filter) {
                const peer = this.peers.get(id);
                if (peer.connection.connectionState !== 'connected') return
                const fdc = peer.connection.createDataChannel(filter)
                fdc.onclose = () => {
                    console.log(`Remote peer ${id} has closed the ${filter} data channel`)
                }
            },
            // Chat
            handleMessageForm(event) {
                event.preventDefault()
                const input = document.querySelector('#chat-msg')
                const message = {
                    text: input.value,
                    timestamp: Date.now(),
                }
                if (message.text === '') return
                this.appendMessage('self', '#chat-log', message)
                for (let id of this.peers.keys()) {
                    this.sendMessage(id, message)
                }
                input.value = ''
            },
            sendMessage(id, message) {
                const peer = this.peers.get(id)
                if (peer.chatChannel && peer.chatChannel.readyState === 'open') {
                    try {
                        peer.chatChannel.send(JSON.stringify(message))
                    } catch(e) {
                        console.error('Error sending message:', e)
                        this.queueMessage(message)
                    }
                } else {
                    this.queueMessage(message)
                }
            },
            appendMessage(sender, log_element, message, image) {
                const log = document.querySelector(log_element)
                const li = document.createElement('li')
                li.className = sender
                li.innerText = message.text
                li.dataset.timestamp = message.timestamp
                if (image) {
                    const img = document.createElement('img')
                    img.src = URL.createObjectURL(image)
                    img.onload = () => {
                        URL.revokeObjectURL(this.src)
                        this.scrollToEnd(log)
                    }
                    li.innerText = '' // undefined on images
                    li.classList.add('img')
                    li.appendChild(img)
                }
                log.appendChild(li)
                this.scrollToEnd(log)
            },
            scrollToEnd(el) {
                if (el.scrollTo) {
                    el.scrollTo({
                        top: el.scrollHeight,
                        behavior: 'smooth'
                    });
                } else {
                    el.scrollTop = el.scrollHeight
                }
            },
            queueMessage(message) {
                this.self.messageQueue.push(message)
            },
            // Image
            handleImageButton(event) {
                let input = document.querySelector('input.temp')
                input = input ? input : document.createElement('input')
                input.className = 'temp'
                input.type = 'file'
                input.accept = '.gif, .jpg, .jpeg, .png'
                input.setAttribute('aria-hidden', true)
                // Safari/iOS requires appending the file input to the DOM
                document.querySelector('#chat-form').appendChild(input)
                input.addEventListener('change', this.handleImageInput)
                input.click()
            },
            handleImageInput(event) {
                event.preventDefault();
                const image = event.target.files[0];
                const metadata = {
                    name: image.name,
                    size: image.size,
                    timestamp: Date.now(),
                    type: image.type
                };
                this.appendMessage('self', '#chat-log', metadata, image);
                // Remove appended file input element
                event.target.remove();
                // Send or queue the file
                for (let id of this.peers.keys()) {
                    this.sendImage(id, metadata, image);
                }
            },
            sendImage(id, metadata, image) {
                const peer = this.peers.get(id);
                if (peer.connection.connectionState === 'connected') {
                    this.sendFile(peer, 'image-', metadata, image);
                } else {
                    this.queueMessage({ metadata: metadata, file: image });
                }
            },
            // User name
            shareUsername(username, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.peers.get(id)
                const udc = peer.connection.createDataChannel(`username-${username}`)
            },
            shareUseravatar(icon, id) {
                console.log(`Attempt to send username to peer ID: ${id}`)
                const peer = this.peers.get(id)
                const udc = peer.connection.createDataChannel(`avatar-${icon}`)
            },
            /**
             *  User-Media and Data-Channel Functions
             */
            async requestUserMedia(media_constraints) {
                this.self.stream = new MediaStream();
                this.self.media = await navigator.mediaDevices.getUserMedia(media_constraints);
                this.self.stream.addTrack(this.self.media.getTracks()[0]);
                this.displayStream('self', this.self.stream);
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
            addStreamingMedia(id, stream) {
                const peer = this.peers.get(id)
                if (stream) {
                    for (let track of stream.getTracks()) {
                        peer.connection.addTrack(track, stream)
                    }
                }
            },
            addChatChannel(id) {
                const peer = this.peers.get(id);
                peer.chatChannel =  peer.connection.createDataChannel('text chat',{ negotiated: true, id: 50 })
                peer.chatChannel.onmessage = (event) => {
                    const message = JSON.parse(event.data)
                    if (!message.id) {
                        const response = {
                            id: message.timestamp,
                            timestamp: Date.now()
                        };
                        try {
                            peer.chatChannel.send(JSON.stringify(response))
                        } catch(e) {
                            this.queueMessage(response)
                        }
                        this.appendMessage('peer', '#chat-log', message)
                    } else {
                        this.handleResponse(message)
                    }
                }
                peer.chatChannel.onclose = (event) => {
                    console.log('Chat channel closed.');
                }
                peer.chatChannel.onopen = (event) => {
                    console.log('Chat channel opened.');
                    for (let message of this.self.messageQueue) {
                        console.log('Sending a message from the queque');
                        if (message.file) {
                            this.sendFile(peer, 'image-', message.metadata, message.file);
                        } else {
                            peer.chatChannel.send(JSON.stringify(message));
                        }
                    }
                }
            },
            handleResponse(response) {
                const item = document.querySelector(`#chat-log *[data-timestamp="${response.id}"]`);
                if (response.timestamp - response.id > 1000) {
                    item.classList.add('received', 'delayed');
                } else {
                    item.classList.add('received');
                }
            },
            // the available features for each peers
            addFeaturesChannel(id) {
                const peer = this.peers.get(id);
                peer.featuresChannel = peer.connection.createDataChannel('features', { negotiated: true, id: 60 });

                peer.featuresChannel.onopen = (event) => {
                    this.self.features.binaryType = peer.featuresChannel.binaryType;
                    // Other feature-detection logic could go here...
                    peer.featuresChannel.send(JSON.stringify(this.self.features));
                };

                peer.featuresChannel.onmessage = (event) => {
                    peer.features = JSON.parse(event.data);
                };
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
            /**
             *  Call Features & Reset Functions
             */
            establishCallFeatures(id) {
                this.registerRtcCallbacks(id)
                // media
                this.addStreamingMedia(id, this.self.stream)
                // share self infos
                if (this.me) {
                    this.shareUsername(this.me.name, id)
                    this.shareUseravatar(this.me.image, id)
                }
                // chat
                this.addChatChannel(id)
                this.addFeaturesChannel(id)
            },
            resetPeer(id, preserve = false) {
                const peer = this.peers.get(id)
                const videoElement = `#peer-${id}`
                peer.connection.close()
                this.displayStream(videoElement, null)
                if (!preserve) {
                    document.querySelector(videoElement).remove()
                    this.peers.delete(id)
                }
            },
            sendFile(peer, prefix, metadata, file) {
                const dc = peer.connection.createDataChannel(`${prefix}${metadata.name}`);
                const chunk = 8 * 1024; // 8K chunks
                dc.onopen = async () => {
                    if (!peer.features ||
                        (this.self.features.binaryType !== peer.features.binaryType)) {
                        dc.binaryType = 'arraybuffer';
                    }
                    // Prepare data according to the binaryType in use
                    const data = dc.binaryType === 'blob' ? file : await file.arrayBuffer();
                    // Send the metadata
                    dc.send(JSON.stringify(metadata));
                    // Send the prepared data in chunks
                    for (let i = 0; i < metadata.size; i += chunk) {
                        dc.send(data.slice(i, i + chunk));
                    }
                }
                dc.onmessage = ({ data }) => {
                    // Sending side will only ever receive a response
                    this.handleResponse(JSON.parse(data));
                    dc.close();
                }
            },
            receiveFile(dc) {
                const chunks = [];
                let metadata;
                let bytesReceived = 0;
                dc.onmessage = ({ data }) => {
                    // Receive the metadata
                    if (typeof data === 'string' && data.startsWith('{')) {
                        metadata = JSON.parse(data);
                    } else {
                        // Receive and squirrel away chunks...
                        bytesReceived += data.size ? data.size : data.byteLength;
                        chunks.push(data);
                        // ...until the bytes received equal the file size
                        if (bytesReceived === metadata.size) {
                            const image = new Blob(chunks, { type: metadata.type });
                            const response = {
                                id: metadata.timestamp,
                                timestamp: Date.now()
                            };
                            this.appendMessage('peer', '#chat-log', metadata, image);
                            // Send an acknowledgement
                            try {
                                dc.send(JSON.stringify(response));
                            } catch(e) {
                                this.queueMessage(response);
                            }
                        }
                    }
                };
            },
            /**
             *  WebRTC Functions and Callbacks
             */
            registerRtcCallbacks(id) {
                const peer = this.peers.get(id);
                peer.connection.onconnectionstatechange = this.handleRtcConnectionStateChange(id)
                peer.connection.onnegotiationneeded = this.handleRtcConnectionNegotiation(id)
                peer.connection.onicecandidate = this.handleRtcIceCandidate(id)
                peer.connection.ontrack = this.handleRtcPeerTrack(id)
                peer.connection.ondatachannel = this.handleRTCDataChannel(id)
            },
            handleRtcPeerTrack(id) {
                return ({ track, streams: [stream] }) => {
                    console.log(`Attempt to display media from peer ID: ${id}`)
                    this.displayStream(`#peer-${id}`, stream)
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
                    const peer = this.peers.get(id);
                    const selfState = peer.selfStates;
                    if (selfState.isSuppressingInitialOffer) return;
                    try {
                        selfState.isMakingOffer = true;
                        console.log('Attempting to make an offer...');
                        await peer.connection.setLocalDescription();
                    } catch(e) {
                        const offer = await peer.connection.createOffer();
                        await peer.connection.setLocalDescription(offer);
                    } finally {
                        this.sc.emit('signal', { to: id, from: this.self.id, signal: { description: peer.connection.localDescription } });
                        selfState.isMakingOffer = false;
                    }
                };
            },
            handleRtcIceCandidate(id) {
                return ({ candidate }) => {
                    this.sc.emit('signal', { to: id, from: this.self.id, signal: { candidate } });
                };
            },
            handleRtcConnectionStateChange(id) {
                return () => {
                    const peer = this.peers.get(id);
                    const connectionState = peer.connection.connectionState;
                    // Assume *some* element will take a unique peer ID
                    const peerElement = document.querySelector(`#peer-${id}`);
                    if (peerElement) {
                        peerElement.dataset.connectionState = connectionState;
                    }
                    console.log(`Connection state '${connectionState}' for Peer ID: ${id}`);
                };
            },
            handleRTCDataChannel(id) {
                return ({ channel }) => {
                    const label = channel.label
                    console.log(`Data channel added for ${label}`)

                    if (label.startsWith('username-')) {
                        document.querySelector(`#peer-${id} figcaption span`).innerText = label.split('username-')[1]
                        channel.onopen = () => {
                            channel.close()
                        };
                    }

                    if (label.startsWith('avatar-')) {
                        document.querySelector(`#peer-${id} figcaption img`).src = `/storage/users/${label.split('avatar-')[1]}.small.jpg`
                        channel.onopen = () => {
                            channel.close()
                        };
                    }

                    if (label.startsWith('filter-')) {
                        document.querySelector(`#peer-${id}`).className = label
                        channel.onopen = () => {
                            channel.close()
                        }
                    }

                    if (label.startsWith('image-')) {
                        this.receiveFile(channel);
                    }

                    console.log(`Opened ${channel.label} channel with an ID of ${channel.id}`)
                }
            },

            /**
             *  Signaling-Channel Functions and Callbacks
             */
            registerScCallbacks() {
                this.sc.on('connect', this.handleScConnect);
                this.sc.on('connected peers', this.handleScConnectedPeers);
                this.sc.on('connected peer', this.handleScConnectedPeer);
                this.sc.on('disconnected peer', this.handleScDisconnectedPeer);
                this.sc.on('signal', this.handleScSignal);
            },
            handleScConnect() {
                console.log('Successfully connected to the signaling server!');
                this.self.id = this.sc.id;
                console.log(`Self ID: ${this.self.id}`);
            },
            handleScConnectedPeers(ids) {
                console.log(`Connected peer IDs: ${ids.join(', ')}`);
                for (let id of ids) {
                    if (id !== this.self.id) {
                        // be polite with already-connected peers
                        this.initializePeer(id, true);
                        this.establishCallFeatures(id);
                    }
                }
            },
            handleScConnectedPeer(id) {
                console.log(`Newly connected peer ID: ${id}`);
                // be impolite with each newly connecting peer
                this.initializePeer(id, false);
                this.establishCallFeatures(id);
            },
            handleScDisconnectedPeer(id) {
                console.log(`Disconnected peer ID: ${id}`);
                this.resetPeer(id);
            },
            async handleScSignal({ from, signal: { candidate, description } }) {
                const id = from
                const peer = this.peers.get(id)
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
                        this.resetAndRetryConnection(id);
                        return;
                    }

                    selfState.isSettingRemoteAnswerPending = false

                    if (description.type === 'offer') {
                        try {
                            await peer.connection.setLocalDescription()
                        } catch(e) {
                            const answer = await peer.connection.createAnswer()
                            await peer.connection.setLocalDescription(answer)
                        } finally {
                            this.sc.emit('signal', { to: id, from: this.self.id, signal: { description: peer.connection.localDescription } })
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
                const polite = this.peers.get(id).selfStates.isPolite;
                this.resetPeer(id, true);
                this.initializePeer(id, polite);
                this.peers.get(id).selfStates.isSuppressingInitialOffer = polite;
                this.establishCallFeatures(id);
                if (polite) {
                    this.sc.emit('signal', { to: id, from: this.self.id, signal: { description: { type: '_reset' } } });
                }
            },
            initializePeer(id, polite) {
                this.peers.set(id, {
                    connection: new RTCPeerConnection(this.self.rtcConfig),
                    selfStates: {
                        isPolite: polite,
                        isMakingOffer: false,
                        isIgnoringOffer: false,
                        isSettingRemoteAnswerPending: false,
                        isSuppressingInitialOffer: false
                    }
                });
            },
            /**
             *  Utility Functions
             */
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
