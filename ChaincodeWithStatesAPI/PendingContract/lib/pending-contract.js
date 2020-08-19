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
        let pending1 = Pending.createInstance('1234','5678', 'Bogdan Ilic', 'Opsta Bolnica Nis', 'Kardiohirurgija', 'Operacija srca', 'AB', 'CD', 'EF', [approver1]);
        let pending2 = Pending.createInstance('4444','5555', 'Darko Ilic', 'Dom Zdravlja', 'Ortopedija' , 'Operacija kolena' ,'AB', 'CD', 'EF', [approver1, approver2]);
        let pending3 = Pending.createInstance('4444','5555', 'Gari Nevil', 'Opsta bolnica Nis', 'Virusologija', 'Detoksikacija', 'GG', 'CD', 'EF', [approver1, approver2]);
        await ctx.pendingList.addPending(pending1);
        await ctx.pendingList.addPending(pending2);
        await ctx.pendingList.addPending(pending3);
    }

    async addPending(ctx, pending) {
        const modeledPending = Pending.fromJSON(pending, Pending);
        const pendingExists = await ctx.pendingList.pendingExists([modeledPending.hospitalCode, modeledPending.ordinationCode, modeledPending.serviceCode, modeledPending.pacientLbo]);
        if (!pendingExists) {
            const pendingData = await ctx.pendingList.addPending(modeledPending);
            return pendingData;
        } else {
            throw new Error(`Pending with key ${modeledPending.hospitalCode}:${modeledPending.ordinationCode}:${modeledPending.serviceCode}:${modeledPending.pacientLbo} already exists!`);
        }
    }

    async getPending(ctx, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
        const pendingData = await ctx.pendingList.getPending([hospitalCode,ordinationCode,serviceCode,pacientLbo]);
        return pendingData;
    }

    async removePending(ctx, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
        const pendingData = await ctx.pendingList.removePending([hospitalCode,ordinationCode,serviceCode,pacientLbo]);
        return pendingData;
    }

    async updatePending(ctx, newPending) {
        const modeledPending = Pending.fromJSON(newPending, Pending);
        const pendingData = await ctx.pendingList.updatePending(modeledPending);
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