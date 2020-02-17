'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Pacient = require('./pacient.js');
const PacientList = require('./pacientList.js');


class PacientContext extends Context {
    constructor() {
        super();

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
        await ctx.pacientList.addPacient(pacient1);
        await ctx.pacientList.addPacient(pacient2);
    }

    async getPacient(ctx, pacientLbo) {
        let pacient = await ctx.pacientList.getPacient(pacientLbo);
        return pacient;
    }

    async getAllPacients(ctx) {
        let allPacients = await ctx.pacientList.getAllPacients();
        console.log(allPacients);
        return JSON.stringify(allPacients);
    }
}

module.exports = PacientContract;