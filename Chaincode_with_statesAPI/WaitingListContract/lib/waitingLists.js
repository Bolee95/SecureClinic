'use strict';

const StateList = require('../../StateApi/statelist.js');
const WaitingList = require('./waitingList.js');

class WaitingLists extends StateList {
    constructor(ctx) {
        super(ctx, 'org.secureclinic.waitingLists');
        this.use(WaitingList);
    }

    async addWaitingList(waitingList) {
        return this.addState(waitingList);
    }

    async getWaitingList(listId) {
        return this.getState(listId);
    }

    async updateWaitingList(waitingList) {
        return this.updateState(waitingList);
    }

    async waitingListExists(listId) {
        return this.stateExists(listId);
    }

    async getAllWaitingLists() {
        return this.getAllStates();
    }

    getAllWaitingListsForHospitalCode(hospitalCode) {
        return this.getAllStates(hospitalCode);
    }
}
module.exports = WaitingLists;