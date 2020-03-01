'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Ammend = require('./ammend.js');
const Approver = require('./approver.js');
const AmmendList = require('./ammendList.js');

class AmmendListContext extends Context {
    constructor() {
        super();
        this.ammendList = new AmmendList(this);
    }
}

class AmmendListContract extends Contract {
    constructor() {
        super('org.secureclinic.ammendlist');
    }

    createContext() {
        return new AmmendListContext();
    }

    async instantiate(ctx) {
        let approver1 = Approver.createInstance('Doctor', 'qwerty1234');
        let approver2 = Approver.createInstance('Director', 'asdfgzx122');

        let ammend1 = Ammend.createInstance('aba123', 'AB', '12345123', 'Delete', '2', '', [], [approver1, approver2]);
        let ammend2 = Ammend.createInstance('eer123', 'FF', '12345678', 'DELETE', '3', 'qazaqd', [], [approver1, approver2]);

        await ctx.ammendList.addAmmend(ammend1);
        await ctx.ammendList.addAmmend(ammend2);
    }

    async addAmmend(ctx, ammend) {
        const modeledAmmend = Ammend.fromJSON(ammend, Ammend);
        const ammendExists = await ctx.ammendList.ammendExists([modeledAmmend.hospitalCode, modeledAmmend.ammendId]);
        if (!ammendExists) {
            const ammendData = await ctx.ammendList.addAmmend(modeledammend);
            return ammendData;
        } else {
            throw new Error(`ammend with key ${[modeledammend.hospitalCode, modeledammend.ammendId]} already exists!`);
        }
    }

    async getAmmend(ctx, hospitalCode, ammendId) {
        const ammendData = await ctx.ammendList.getAmmend([hospitalCode, ammendId]);
        return ammendData;
    }

    async updateAmmend(ctx, newammend) {
        const modeledammend = ammend.fromJSON(newammend, ammend);
        const ammendData = await ctx.ammendList.updateAmmend(modeledammend);
        return ammendData;
    }

    async getAllAmmends(ctx) {
        const allAmmendsData = await ctx.ammendList.getAllAmmends();
        return new (Ammend)(allAmmendsData);
    }

    async getAllAmmendsForHospital(ctx, hospitalCode) {
        const allAmmendData = await ctx.ammendList.getAllAmmendsForHospital(hospitalCode);
        return new (Ammend)(allAmmendData);
    }
}
module.exports = AmmendListContract;