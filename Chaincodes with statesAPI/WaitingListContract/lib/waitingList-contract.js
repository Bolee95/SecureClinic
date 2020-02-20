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
        let acceptedPacient1 = AcceptedPacient.createInstance('1234qwerty', 'Leskovac', '01.02.2020', '60', '5.6');
        let acceptedPacient2 = AcceptedPacient.createInstance('asdfgh1234', 'Beograd', '04.10.2020','40', '10.0');
        let acceptedPacient3 = AcceptedPacient.createInstance('qzmk231gk', 'Krusevac', '02.02.2020', '10','4.0');

        let waitingList1 = WaitingList.createInstance('AB','CD','EF',[acceptedPacient1,acceptedPacient2]);
        let waitingList2 = WaitingList.createInstance('CD','AB','KG',[acceptedPacient3]);
        let waitingList3 = WaitingList.createInstance('AB','QQ','WW',[acceptedPacient3]);
        await ctx.waitingLists.addWaitingList(waitingList1);
        await ctx.waitingLists.addWaitingList(waitingList2);
        await ctx.waitingLists.addWaitingList(waitingList3);
    }

    async addWaitingList(ctx, waitingList) {
        const waitingListData = await ctx.waitingLists.addWaitingList(waitingList);
        return waitingListData;
    }

    async getWaitingList(ctx, hospitalCode, serviceCode, ordinationCode) {
        const waitingListData = await ctx.waitingLists.getWaitingList([hospitalCode, serviceCode, ordinationCode]);
        return waitingListData;
    }

    async updateWaitingList(ctx, waitingList) {
        const waitingListData = await ctx.waitingLists.updateWaitingList(waitingList);
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

