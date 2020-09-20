'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Hospital = require('./hospital.js');
const Entity = require('./entity.js');
const HospitalService = require('./hospitalService.js');
const HospitalOrdination = require('./hospitalOrdination.js');
const HospitalList = require('./hospitallist.js');
const XLSX = require('xlsx');

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
        // Getting hospitals data from excel file packed with contract
        let workbook = XLSX.readFile(__dirname +  '/ZdravstveneUstanovev4excel.xlsx');
        let sheetNameList = workbook.SheetNames;
        let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

        // Test data
        let entity1 = Entity.createInstance('Bogdan Bogdanovic', 'abc1212', 'Director');
        let entity2 = Entity.createInstance('Darko Ilic', 'qwer123', 'Doctor');
        let hospitalService1 = HospitalService.createInstance('Operacija srca','AB1', 10);
        let hospitalService2 = HospitalService.createInstance('Operacija kolena', 'A21', 30);
        let hospitalOrdination1 = HospitalOrdination.createInstance('Kardiohirurgija', 'AA');
        let hospitalOrdination2 = HospitalOrdination.createInstance('Ortopedija', 'BB');

        await this.asyncForEach(sheetData, async (row) => {
            // eslint-disable-next-line dot-notation
            let hospital = Hospital.createInstance(row['NazivOrgDela'], row['ID'], true, row['Grad'], [hospitalOrdination1, hospitalOrdination2], [hospitalService1, hospitalService2], [entity1, entity2]);
            await ctx.hospitalList.addHospital(hospital);
        });
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
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