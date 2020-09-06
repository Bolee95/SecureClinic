'use strict';

const StateList = require('./StateApi/statelist.js');
const Ammend = require('./ammend.js');

class AmmendList extends StateList {
    constructor(ctx) {
        super(ctx,'org.scureclinic.ammendlist');
        this.use(Ammend);
    }

    async addAmmend(ammend) {
        return this.addState(ammend);
    }

    async getAmmend(ammendId) {
        return this.getState(ammendId);
    }

    async updateAmmend(ammend) {
        return this.updateState(ammend);
    }

    async ammendExists(ammendId) {
        return this.stateExists(ammendId);
    }

    async removeAmmend(ammendId) {
        return this.deleteState(ammendId);
    }

    async getAllAmmends() {
        return this.getAllStates();
    }

    async getAllAmmendsForHospital(hospitalCode) {
        return this.getAllStates(hospitalCode);
    }
}
module.exports = AmmendList;