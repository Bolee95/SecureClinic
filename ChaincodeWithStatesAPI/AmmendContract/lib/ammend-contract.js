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

        //hospitalCode, ordinationCode, serviceCode, pacientLbo, action, description, evidencesList, approversList
        let ammend1 = Ammend.createInstance('AB', 'AA', 'AC1', '001', 1, 'Description', [], [approver1, approver2], false);
        let ammend2 = Ammend.createInstance('AB', 'AA', 'AD', '002', 2, 'Description', [], [approver1, approver2], false);

        await ctx.ammendList.addAmmend(ammend1);
        await ctx.ammendList.addAmmend(ammend2);
    }

    async addAmmend(ctx, ammend) {
        const modeledAmmend = Ammend.fromJSON(ammend, Ammend);
        const ammendExists = await ctx.ammendList.ammendExists([modeledAmmend.hospitalCode, modeledAmmend.ordinationCode, modeledAmmend.serviceCode, modeledAmmend.pacientLbo]);
        if (!ammendExists) {
            const ammendData = await ctx.ammendList.addAmmend(modeledAmmend);
            return ammendData;
        } else {
            throw new Error(`Ammend with key ${modeledAmmend.hospitalCode}:${modeledAmmend.ordinationCode}:${modeledAmmend.serviceCode}:${modeledAmmend.pacientLbo} already exists!`);
        }
    }

    async getAmmend(ctx, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
        const ammendData = await ctx.ammendList.getAmmend([hospitalCode, ordinationCode, serviceCode, pacientLbo]);
        return ammendData;
    }

    async updateAmmend(ctx, newAmmend) {
        const modeledAmmend = Ammend.fromJSON(newAmmend, Ammend);
        const ammendData = await ctx.ammendList.updateAmmend(modeledAmmend);
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