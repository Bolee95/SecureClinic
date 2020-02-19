'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Service = require('./service.js');
const Facility = require('./facility.js');
const FacilityList = require('./facilityList.js');

class FacilityContext extends Context {
    constructor() {
        super();
        this.facilitiesList = new FacilityList(this);
    }
}

class FacilityContract extends Contract {

    constructor() {
        super('org.secureclinic.facility');
    }

    createContext() {
        return new FacilityContext();
    }

    async instantiate(ctx) {
        let service1 = Service.createInstance('A5-22', 'Operacija srca', 60);
        let service2 = Service.createInstance('A5-AA', 'Operacija zaliska', 30);
        let facility1 = Facility.createInstance('Kardiologija', 'A5', [service1, service2]);
        await ctx.facilitiesList.addFacility(facility1);
        let service3 = Service.createInstance('B1-11', 'Operacija kolena', 120);
        let service4 = Service.createInstance('B1-QQ', 'Operacija uva', 360);
        let facility2 = Facility.createInstance('Hirurgija', 'B1', [service3, service4]);
        await ctx.facilitiesList.addFacility(facility2);
    }

    async getFacility(ctx, facilityCode) {
        const facilityData = await ctx.facilitiesList.getFacility(facilityCode);
        return facilityData; 
    }

    async updateFacility(ctx, facility) {
        const facility = await ctx.facilitiesList.updateFacility(facility);
    }

    async getAllFacilities(ctx) {
        const allFacilities = await ctx.facilitiesList.getAllFacilities();
        return new (Facility)(allFacilities);
    }
}

module.exports = FacilityContract;