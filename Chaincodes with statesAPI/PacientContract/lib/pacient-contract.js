'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Pacient = require('./pacient.js');
const PacientPrivateData = require('./pacientPrivateData.js');
const PacientList = require('./pacientList.js');
const PacientPrivateDataList = require('./pacientPrivateDataList.js');


class PacientContext extends Context {
    constructor() {
        super();
        this.pacientPrivateDataList = new PacientPrivateDataList(this);
        this.pacientList = new PacientList(this);
    }
}

class PacientContract extends Contract {

    constructor() {
        super('org.secureclinic.pacient');
    }

    createContext() {
        return new PacientContext();
    }

    async instantiate(ctx) {
        let pacient1 = Pacient.createInstance('Bogdan', 'Ilic', '001', '0123456789', 'qwerty1234', 'Leskovac', '','','','');
        let pacient2 = Pacient.createInstance('Darko','Ilic','002','0123456624','qaqa12', 'Beograd', '1', 'Opsta Bolnica', 'AD1', 'DD2');
        let pacientPrivateData1 = PacientPrivateData.createInstance('Hello','12355112',[ {'CD':true}, {'AP':false}],['123456ada', 'qwerty1234']);
        await ctx.pacientList.addPacient(pacient1);
        await ctx.pacientList.addPacient(pacient2);
        await ctx.pacientPrivateDataList.addPacientPrivateData(pacientPrivateData1);
    }

    async getPacient(ctx, pacientLbo) {
        let pacientData = await ctx.pacientList.getPacient(pacientLbo);
        return pacientData;
    }

    async updatePacient(ctx, newPacient) {
        let pacient = await ctx.pacientList.updatePacient(newPacient.lbo, newPacient);
        return pacient;
    }

    async removePacient(ctx, pacientLbo) {
        let pacientRemoved = await ctx.pacientList.removePacient(pacientLbo);
        return pacientRemoved;
    }

    async getPacientPrivateData(ctx, pacientId) {
        let pacientData = await ctx.pacientPrivateDataList.getPacientPrivateData(pacientId);
        return pacientData;
    }

    async updatePacientPrivateData(ctx, pacientData) {
        let pacientData = await ctx.pacientPrivateDataList.updatePacientPrivateData(pacientData.uniqueId, pacientData);
        return pacientData;
    }

    async getAllPacients(ctx) {
        let allPacients = await ctx.pacientList.getAllPacients();
        //allPacients.forEach(pacient => {
        //    console.log(pacient);
        //    let pacienttest = new (Pacient)(pacient);
        //    console.log(pacienttest);
        //});
        return new (Pacient)(allPacients);
    }

}
module.exports = PacientContract;