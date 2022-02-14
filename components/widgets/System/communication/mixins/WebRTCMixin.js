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
