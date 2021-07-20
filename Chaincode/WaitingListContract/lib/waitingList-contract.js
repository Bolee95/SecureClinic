'use strict';

const { Contract, Context } = require('fabric-contract-api');

const WaitingList = require('./waitingList.js');
const AcceptedPacient = require('./acceptedPacient.js');
const WaitingLists = require('./waitingLists.js');

class WaitingListContext extends Context {
    constructor() {
        super();
        this.waitingLists = new WaitingLists(this);
    }
}

class WaitingListContract extends Contract {
    constructor() {
        super('org.secureclinic.waitinglist');
    }

    createContext() {
        return new WaitingListContext();
    }

    async instantiate(ctx) {
        let acceptedPacient1 = AcceptedPacient.createInstance('1234', 'Petar Petrovic', 'Nis', '1598006737', '9', '1598784337');
        let acceptedPacient2 = AcceptedPacient.createInstance('5678', 'Igor Djordjevic', '1598006737','10', '1598784337');
        let acceptedPacient3 = AcceptedPacient.createInstance('9012', 'Djordje Gavrilovic', '1598006737', '8','1598784337');

        let waitingList1 = WaitingList.createInstance('Opsta Bolnica, Nis', 'Kardiohirurgija', 'Operacija srca', 'AB','CD','EF',[acceptedPacient1,acceptedPacient2], 30);
        let waitingList2 = WaitingList.createInstance('Vojno-Medicinska Bolnica, Beograd', 'Ortopedija', 'Operacija kolena','CD','AB','KG',[acceptedPacient3], 120);
        let waitingList3 = WaitingList.createInstance('Klinicki centar Novi Sad', 'Ortopedija', 'Operacija katarakte', 'AB','QQ','WW',[acceptedPacient3], 300);
        await ctx.waitingLists.addWaitingList(waitingList1);
        await ctx.waitingLists.addWaitingList(waitingList2);
        await ctx.waitingLists.addWaitingList(waitingList3);
    }

    async addWaitingList(ctx, waitingList) {
        const modeledWaitingList = WaitingList.fromJSON(waitingList, WaitingList);
        const waitingListExists = await ctx.waitingLists.waitingListExists([modeledWaitingList.hospitalCode, modeledWaitingList.ordinationCode, modeledWaitingList.serviceCode]);
        if (!waitingListExists) {
            const waitingListData = await ctx.waitingLists.addWaitingList(modeledWaitingList);
            return waitingListData;
        } else {
            throw new Error(`WaitingList with key ${modeledWaitingList.hospitalCode}:${modeledWaitingList.ordinationCode}:${modeledWaitingList.serviceCode} already exists!`)
        }
    }

    async getWaitingList(ctx, hospitalCode, ordinationCode, serviceCode) {
        const waitingListData = await ctx.waitingLists.getWaitingList([hospitalCode, ordinationCode, serviceCode]);
        return waitingListData;
    }

    async updateWaitingList(ctx, newWaitingList) {
        const modeledWaitingList = WaitingList.fromJSON(newWaitingList, WaitingList);
        const waitingListData = await ctx.waitingLists.updateWaitingList(modeledWaitingList);
        return waitingListData;
    }

    async getAllWaitingLists(ctx) {
        const allWaitingLists = await ctx.waitingLists.getAllWaitingLists();
        return new (WaitingList)(allWaitingLists);
    }

    async getAllWaitingListsForHospital(ctx, hospitalCode) {
        const allWaitingLists = await ctx.waitingLists.getAllWaitingListsForHospitalCode(hospitalCode);
        return new (WaitingList)(allWaitingLists);
    }
}
module.exports = WaitingListContract;

