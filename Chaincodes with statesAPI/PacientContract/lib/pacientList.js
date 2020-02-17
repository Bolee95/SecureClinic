'use strict';

const StateList = require('../../StateApi/statelist.js');
const Pacient = require('./pacient.js');

class PacientList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.secureclinic.pacientlist');
        this.use(Pacient);
    }

    async addPacient(pacient) {
        return this.addState(pacient);
    }

    async getPacient(pacientKey) {
        return this.getState(pacientKey);
    }

    async pacientExists(pacientKey) {
        return this.stateExists(pacientKey);
    }

    async updatePacient(pacient) {
        return this.updateState(pacient);
    }
    
    async removePacient(pacientKey) {
        return this.deleteState(pacientKey);
    }

    async getAllPacients() {
        return this.getAllStates('0000000000','9999999999');
    }
}

module.exports = PacientList;