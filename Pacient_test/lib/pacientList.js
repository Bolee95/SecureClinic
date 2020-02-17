'use strict';

const StateList = require('./statelist.js');
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

    async updatePacient(pacient) {
        return this.updateState(pacient);
    }

    async getAllPacients() {
        return this.getAllStates();
    }
}

module.exports = PacientList;