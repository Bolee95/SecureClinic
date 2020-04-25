'use strict';
// Pacient
const addPacient = require('../Doctor/Pacient/addPacient');
const changePacientStatusToPending = require('../Doctor/Pacient/changePacientStatusToPending');
const changePacientStatusToWaiting = require('../Doctor/Pacient/changePacientStatusToWaiting');
const getAllPacients = require('../Doctor/Pacient/getAllPacients');
const resetPacientWaitingStatus = require('../Doctor/Pacient/resetPacientWaitingStatus');
// Pending
const createNewPending = require('../Doctor/Pending/createNewPending');

class DoctorService {

    // Pacient
    async addPacient(identityName, name, surname, lbo, jmbg, uniqueId, city) {
        const result = await addPacient(identityName, name, surname, lbo, jmbg, uniqueId, city);
        return result;
    }

    async changePacientStatusToPending(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode) {
        const result = await changePacientStatusToPending(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode);
        return result;
    }

    async changePacientStatusToWaiting(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode) {
        const result = await changePacientStatusToWaiting(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode);
        return result;
    }

    async getAllPacients(identityName) {
        const result = await getAllPacients(identityName);
        return result;
    }

    async resetPacientWaitingStatus(identityName, pacientLbo) {
        const result = await resetPacientWaitingStatus(identityName, pacientLbo);
        return result;
    }

    // Pending 
    async createNewPending() {
        const result = await createNewPending(identityName, pacientLbo, pacientJmbg, hospitalCode, serviceCode, ordinationCode);
        return result;
    }
}

module.exports = DoctorService;