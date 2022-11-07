import Vue from "vue";

export default {
    /*
    |------------------------------------
    | NETWORKS
    |------------------------------------
    */

    setNetwork(state, network) {
        state.network = {...network}
    },
    setNetworks(state, paginatedNetworks) {
        state.paginatedNetworks = paginatedNetworks
    },

    /*
    |------------------------------------
    | ROOMS
    |------------------------------------
    */

    updateRoom(state, payload) {
        state.network.rooms.forEach((room, idx) => {
            if(room.id == payload.id) {
                Vue.set(state.network.rooms, idx, {...payload})
            }
        });
    },
    addRoom(state, room) {
        state.network.rooms.push(room)
    },
    deleteRoom(state, roomId) {
        state.network.rooms.forEach((room, idx) => {
            if(room.id == roomId) {
                state.network.rooms.splice(idx, 1);
            }
        });
    },
    setRoom(state, room) {
        state.room = {...room}
    }
}
