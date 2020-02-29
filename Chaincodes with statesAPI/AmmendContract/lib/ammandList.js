'use strict';

const StateList = require('../../StateApi/statelist.js');
const Ammand = require('./ammend.js');

class AmmandList extends StateList {
    constructor(ctx) {
        super(ctx,'org.scureclinic.ammandlist');
        this.use(Ammand);
    }

    async addAmmand(ammand) {
        return this.addState(ammand);
    }

    async getAmmand(ammandId) {
        return this.getState(ammandId);
    }

    async updateAmmand(ammand) {
        return this.updateState(ammand);
    }

    async removeAmmend(ammandId) {
        return this.deleteState(ammandId);
    }

    async getAllAmmands() {
        return this.getAllStates();
    }

    async getAllAmmendsForHospital(hospitalCode) {
        return this.getAllAmmands(hospitalCode);
    }
}
module.exports = AmmandList;