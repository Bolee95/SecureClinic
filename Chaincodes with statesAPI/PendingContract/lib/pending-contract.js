'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Pending = require('./pending.js');
const Approver = require('./approver.js');
const PendingList = require('./pendingList.js');


class PendingContext extends Context {
    constructor() {
        super();
        this.pendingList = new PendingList(this);
    }
}

class PendingContract extends Contract {
    constructor() {
        super('org.secureclinic.pending');
    }

    createContext() {
        return new PendingContext();
    }

    async instantiate(ctx) {
        let approver1 = Approver.createInstance('123456789', 'Director');
        let approver2 = Approver.createInstance('23232145','Doctor');
        let pending1 = Pending.createInstance('ABCDEF','1234','5678', 'AB', 'CD', 'EF', [approver1]);
        let pending2 = Pending.createInstance('ABCDEF','4444','5555', 'AB', 'CD', 'EF', [approver1, approver2]);
        let pending3 = Pending.createInstance('GGCDEF','4444','5555', 'GG', 'CD', 'EF', [approver1, approver2]);
        await ctx.pendingList.addPending(pending1);
        await ctx.pendingList.addPending(pending2);
        await ctx.pendingList.addPending(pending3);
    }

    async addPending(ctx, pending) {
        const pendingData = await ctx.pendingList.addPending(pending);
        return pendingData;
    }

    async getPending(ctx, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const pendingData = await ctx.pendingList.getPending([hospitalCode,serviceCode,ordinationCode,pacientLbo]);
        return pendingData;
    }

    async updatePending(ctx, pending) {
        const pendingData = await ctx.pendingList.updatePending(pending);
        return pendingData;
    }

    async getAllPendings(ctx) {
        const allPendings = await ctx.pendingList.getAllPendings();
        return new (Pending)(allPendings);
    }

    async getAllPendingsForHospitalCode(ctx, hospitalCode) {
        const allPendings = await ctx.pendingList.getAllPendingsForHospitalCode(hospitalCode);
        return new (Pending)(allPendings);
    }
}
module.exports = PendingContract;