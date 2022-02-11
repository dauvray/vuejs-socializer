<template>
    <aside id="chat">
        <h2 class="preserve-access">Text Chat</h2>
        <ol id="chat-log" ref="chat-log">
            <message-widget
                v-for="(message,idx) in messages"
                :key="`msg-${idx}`"
                :message="message"
                @scroll-to-end="scrollToEnd"
            ></message-widget>
        </ol>
        <form id="chat-form" action="#null" v-on:submit.prevent="handleMessageForm">
            <label for="chat-msg" class="preserve-access">Compose Message</label>
            <input type="text" id="chat-msg" name="chat-msg" autocomplete="off" />
            <label for="chat-img-btn" class="preserve-access" >Send Image</label>
            <button type="button" id="chat-img-btn" @click="handleImageButton">Image</button>
            <button type="submit" id="chat-btn">Send</button>
        </form>
    </aside>
</template>

<script>
    import WebRTCMixin from 'vuejs-socializer/components/widgets/System/communication/mixins/WebRTCMixin'
    export default {
        name: "WebRTCChatComponent",
        inject: ["eventBus"],
        mixins: [
            WebRTCMixin
        ],
        components: {
          MessageWidget: () => import('vuejs-socializer/components/widgets/System/communication/webRTCChatComponent/Message')
        },
        props: {
            peers: {
                type: Object,
                required: true,
            },
            self: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                messages: [],
                messageQueue: [],
                peer: null,
            }
        },
        created() {
            this.eventBus.$on('socializer-establish-features', this.addChatChannel)
            this.eventBus.$on('socializer-handle-rtc-data-channel', this.handleRTCDataChannel)
            this.eventBus.$on('socializer-dtc-onmessage', this.onMessage)
            this.eventBus.$on('socializer-dtc-onclose', this.onClose)
            this.eventBus.$on('socializer-dtc-onopen', this.onOpen)
        },
        methods: {
            /**
             *  WebRTC Functions and Callbacks
             */
            addChatChannel(id) {
                this.peer = this.getPeer(id)
                this.$emit('create-data-channel', {
                    peerId: id,
                    channel: 'chatChannel',
                    label: 'text chat',
                    config: {
                        negotiated: true,
                        id: 50
                    },
                    onmessage: (event) => {this.eventBus.$emit('socializer-dtc-onmessage', event)},
                    onclose: (event) => {this.eventBus.$emit('socializer-dtc-onclose', event)},
                    onopen: (event) => { this.eventBus.$emit('socializer-dtc-onopen', event)}
                })
            },
            // obj = {id, channel }
            handleRTCDataChannel(obj) {
                const label = obj.channel.label
                if (label.startsWith('image-')) {
                    this.receiveFile(obj.channel)
                }
            },
            onMessage(event) {
                const message = JSON.parse(event.data)
                if (!message.id) {
                    const response = {
                        id: message.timestamp,
                        timestamp: Date.now()
                    };
                    try {
                        this.peer.chatChannel.send(JSON.stringify(response))
                    } catch(e) {
                        this.queueMessage(response)
                    }
                    this.appendMessage('peer', message)
                } else {
                    this.handleResponse(message)
                }
            },
            onClose(event) {
                console.log('Chat channel closed.');
            },
            onOpen(event) {
                for (let message of this.messageQueue) {
                    console.log('Sending a message from the queque');
                    if (message.file) {
                        this.sendFile(peer, 'image-', message.metadata, message.file);
                    } else {
                        this.peer.chatChannel.send(JSON.stringify(message));
                    }
                }
            },

            /**
             *  Component functions
             */
            // Chat
            handleMessageForm(event) {
                event.preventDefault()
                const input = document.querySelector('#chat-msg')
                const message = {
                    text: input.value,
                    timestamp: Date.now(),
                    nickname: this.self.me.name
                }
                if (message.text === '') return
                this.appendMessage('self', message)
                this.peers.forEach(peer => {
                    this.sendMessage(peer, message)
                })
                // for (let id in this.peers) {
                //     this.sendMessage(id, message)
                // }
                input.value = ''
            },
            sendMessage(peer, message) {
                //const peer = this.getPeer(id)
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
            appendMessage(sender, message, image) {
                this.messages.push({
                    sender,
                    message,
                    image
                })
                this.scrollToEnd()
            },
            scrollToEnd() {
                const el = this.$refs['chat-log']
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
                this.messageQueue.push(message)
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
                event.preventDefault()
                const image = event.target.files[0]
                const metadata = {
                    name: image.name,
                    nickname: this.self.me.name,
                    size: image.size,
                    timestamp: Date.now(),
                    type: image.type
                }
                this.appendMessage('self',  metadata, image)
                // Remove appended file input element
                event.target.remove()
                // Send or queue the file
                this.peers.forEach(peer => {
                    this.sendImage(peer, metadata, image)
                })
            },
            sendImage(peer, metadata, image) {
                if (peer.connection.connectionState === 'connected') {
                    this.sendFile(peer, 'image-', metadata, image)
                } else {
                    this.queueMessage({ metadata: metadata, file: image })
                }
            },
            sendFile(peer, prefix, metadata, file) {
                const dc = peer.connection.createDataChannel(`${prefix}${metadata.name}`)
                const chunk = 8 * 1024; // 8K chunks
                dc.onopen = async () => {
                    if (!peer.features ||
                        (this.self.features.binaryType !== peer.features.binaryType)) {
                        dc.binaryType = 'arraybuffer'
                    }
                    // Prepare data according to the binaryType in use
                    const data = dc.binaryType === 'blob' ? file : await file.arrayBuffer()
                    // Send the metadata
                    dc.send(JSON.stringify(metadata))
                    // Send the prepared data in chunks
                    for (let i = 0; i < metadata.size; i += chunk) {
                        dc.send(data.slice(i, i + chunk))
                    }
                }
                dc.onmessage = ({ data }) => {
                    // Sending side will only ever receive a response
                    this.handleResponse(JSON.parse(data))
                    dc.close()
                }
            },
            receiveFile(dc) {
                const chunks = []
                let metadata
                let bytesReceived = 0
                dc.onmessage = ({ data }) => {
                    // Receive the metadata
                    if (typeof data === 'string' && data.startsWith('{')) {
                        metadata = JSON.parse(data)
                    } else {
                        // Receive and squirrel away chunks...
                        bytesReceived += data.size ? data.size : data.byteLength
                        chunks.push(data)
                        // ...until the bytes received equal the file size
                        if (bytesReceived === metadata.size) {
                            const image = new Blob(chunks, { type: metadata.type })
                            const response = {
                                id: metadata.timestamp,
                                timestamp: Date.now()
                            }
                            this.appendMessage('peer', metadata, image)
                            // Send an acknowledgement
                            try {
                                dc.send(JSON.stringify(response))
                            } catch(e) {
                                this.queueMessage(response)
                            }
                        }
                    }
                };
            },
            handleResponse(response) {
                setTimeout(() => {
                    const item = document.querySelector(`#chat-log *[data-timestamp="${response.id}"]`)
                    if (response.timestamp - response.id > 1000) {
                        item.classList.add('received', 'delayed')
                    } else {
                        item.classList.add('received')
                    }
                },500)
            },
        }
    }
</script>

<style scoped>

</style>
