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

    setNumberOfAmmends(numOfAmmends) {
        this.numOfAmmends = numOfAmmends;
    }

    getNumOfAmmends() {
        return this.numOfAmmends;
    }

    setNumberOfUnapprovedAmmends(numOfUnapprovedAmmends) {
        this.numOfUnapprovedAmmends = numOfUnapprovedAmmends;
    }

    getNumOfUnapprovedAmmends() {
        return this.numOfUnapprovedAmmends;
    }

    setNumberOfApprovedAmmends(numOfApprovedAmmends) {
        this.numOfApprovedAmmends = numOfApprovedAmmends;
    }

    getNumOfApprovedAmmends() {
        return this.numOfApprovedAmmends;
    }

    setNumberOfPendings(numOfPendings) {
        this.numOfPendings = numOfPendings;
    }

    getNumOfPendings() {
        return this.numOfPendings;
    }

    setNumberOfUnapprovedPendings(numOfUnapprovedPendings) {
        this.numOfUnapprovedPendings = numOfUnapprovedPendings;
    }

    getNumOfUnapprovedPendings() {
        return this.numOfUnapprovedPendings;
    }

    setNumberOfApprovedPending(numOfApprovedPendings) {
        this.numOfApprovedPendings = numOfApprovedPendings;
    }

    getNumOfApprovedPendings() {
        return this.numOfApprovedPendings;
    }

    setWaitingListsStats(stats) {
        this.waitingListStats = stats;
    }

    getWaitingListsStats() {
        return this.waitingListsStats;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(timestamp, numPacients, numServices, numAmmends, numUnapprovedAmmends, numApprovedAmmends, numPendings, numUnapprovedPendings, numApprovedPendings, waitingListsStats) {
        return new Stats({ timestamp, numPacients, numServices, numAmmends, numUnapprovedAmmends, numApprovedAmmends, numPendings, numUnapprovedPendings, numApprovedPendings, waitingListsStats});
    }
}
module.exports = Stats;