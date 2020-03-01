'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Hospital = require('./hospital.js');
const Entity = require('./entity.js');
const HospitalService = require('./hospitalService.js');
const HospitalList = require('./hospitallist.js');

class HospitalContext extends Context {
    constructor() {
        super();
        this.hospitalList = new HospitalList(this);
    } 
}

class HospitalContract extends Contract {
    constructor() {
        super('org.secureclinic.hospital');
    }

    createContext() {
        return new HospitalContext();
    }

    async instantiate(ctx) {
        let entity1 = Entity.createInstance('Bogdan Bogdanovic', 'abc1212', 'Director');
        let entity2 = Entity.createInstance('Darko Ilic', 'qwer123', 'Doctor');
        let hospitalService1 = HospitalService.createInstance('AB1', 10);
        let hospital1 = Hospital.createInstance('Opsta Bolnica', 'AD', true, 'Nis', [], [hospitalService1], [entity1, entity2]);
        await ctx.hospitalList.addHospital(hospital1);
    }

    async addHospital(ctx, hospital) {
        const modeledHospital = Hospital.fromJSON(hospital, Hospital);
        const hospitalExists = await ctx.hospitalList.hospitalExists(modeledHospital.hospitalCode);
        if (!hospitalExists) {
            const hospitalData = await ctx.hospitalList.addHospital(modeledHospital);
            return hospitalData;
        } else {
            throw new Error(`Hospital with hospitalCode ${modeledHospital.hospitalCode} already exists!`);
        }
    }

    async getHospital(ctx, hospitalCode) {
        const hospitalData = await ctx.hospitalList.getHospital(hospitalCode);
        return hospitalData;
    }

    async updateHospital(ctx, hospital) {
        const modeledHospital = Hospital.fromJSON(hospital, Hospital);
        const hospitalData = await ctx.hospitalList.updateHospital(modeledHospital);
        return hospitalData;
    }

    async getAllHospitals(ctx) {
        const allHospitals = await ctx.hospitalList.getAllHospitals();
        return new (Hospital)(allHospitals);
    }
}
module.exports = HospitalContract;