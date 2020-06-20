'use strict';

const StateList = require('./StateApi/statelist.js');
const Facility = require('./facility.js');

class FacilitiesList extends StateList {

    constructor(ctx){
        super(ctx, 'org.secureclinic.facilitiesList');
        this.use(Facility);
    }

    async addFacility(facility) {
        return this.addState(facility);
    }

    async getFacility(facilityCode) {
        return this.getState(facilityCode);
    }

    async updateFacility(facility) {
        return this.updateState(facility);
    }

    async facilityExists(facilityCode) {
        return this.stateExists(facilityCode);
    }

    async getAllFacilities() {
        return this.getAllStates();
    }
}

module.exports = FacilitiesList;