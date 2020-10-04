'use strict';

class Stats {
    constructor(obj) {
        Object.assign(this,obj);
    }

    setNumberOfPacients(numOfPacients) {
        this.numPacients = numOfPacients;
    }

    getNumOfPacients() {
        return this.numPacients;
    }

    setNumberOfWaitingLists(numOfWaitingLists) {
        this.numWaitingLists = numOfWaitingLists;
    }

    getNumOfWaitingLists() {
        return this.numWaitingLists;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(timestamp, numPacients, numServices) {
        return new Stats({ timestamp, numPacients, numServices });
    }
}
module.exports = Stats;