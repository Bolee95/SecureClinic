'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Ammand = require('./ammend.js');
const Approver = require('./approver.js');
const AmmandList = require('./ammandList.js');

class AmmandListContext extends Context {
    constructor() {
        super();
        this.ammandList = new AmmandList(this);
    }
}

class AmmandListContract extends Contract {
    constructor() {
        super('org.secureclinic.ammandlist');
    }

    createContext() {
        return new AmmandListContext();
    }

    async instantiate(ctx) {
        let approver1 = Approver.createInstance('Doctor', 'qwerty1234');
        let approver2 = Approver.createInstance('Director', 'asdfgzx122');

        let ammand1 = Ammand.createInstance('aba123', 'AB','12345123','Delete','2','',[],[approver1,approver2]);
        let ammand2 = Ammand.createInstance('eer123','FF','12345678','DELETE','3','qazaqd',[],[approver1,approver2]);

        await ctx.ammandList.addAmmand(ammand1);
        await ctx.ammandList.addAmmand(ammand2);
    }

    async addAmmand(ctx, ammand) {
        const ammandData = await ctx.ammandList.addAmmand(ammand);
        return ammandData;
    }

    async getAmmand(ctx, hospitalCode, ammandId) {
        const ammandData = await ctx.ammandList.getAmmand([hospitalCode, ammandId]);
        return ammandData;
    }

    async updateAmmand(ctx, ammand) {
        const ammandData = await ctx.ammandList.updateAmmand(ammand);
        return ammandData;
    }

    async getAllAmmands(ctx) {
        const allAmmandsData = await ctx.ammandList.getAllAmmands();
        return new (Ammand)(allAmmandsData);
    }

    async getAllAmmandsForHospital(ctx, hospitalCode) {
        const allAmmandData = await ctx.ammandList.getAllAmmandsForHospital(hospitalCode);
        return new (Ammand)(allAmmandData);
    }
}
module.exports = AmmandListContract;