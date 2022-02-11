export default {
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
    }
}
