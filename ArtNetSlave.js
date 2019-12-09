'use strict';
class ArtNetSlave {
    constructor(ipAdress, port, type) {
        this.ipAdress = ipAdress;
        this.port = port;
        this.type = type;
    }
}

module.exports = ArtNetSlave