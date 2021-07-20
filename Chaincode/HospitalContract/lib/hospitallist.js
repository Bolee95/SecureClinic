'use strict';

const StateList = require('./StateApi/statelist.js');
const Hospital = require('./hospital.js');

class HospitalList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.secureclinic.hospitallist');
        this.use(Hospital);
    }

    async addHospital(hospital) {
        return this.addState(hospital);
    }

    async getHospital(hospitalCode) {
        return this.getState(hospitalCode);
    }

    async updateHospital(hospital) {
        return this.updateState(hospital);
    }

    async hospitalExists(hospitalCode) {
        return this.stateExists(hospitalCode);
    }

    async getAllHospitals() {
        return this.getAllStates();
    }
}

module.exports = HospitalList;