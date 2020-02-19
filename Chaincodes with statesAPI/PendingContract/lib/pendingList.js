'use strict';

const StateList = require('../../StateApi/statelist.js');
const Pending = require('./pending');

class PendingList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.secureclinic.pendinglist');
        this.use(Pending);
    }

    async addPending(pending) {
        return this.addState(pending);
    }

    async getPending(listId) {
        return this.getState(listId);
    }

    async updatePending(pending) {
        return this.updateState(pending);
    }

    async getAllPendings() {
        return this.getAllStates();
    }

    async getAllPendingsForHospitalCode(hospitalCode) {
        return this.getAllStates(hospitalCode);
    }
}
module.exports = PendingList;