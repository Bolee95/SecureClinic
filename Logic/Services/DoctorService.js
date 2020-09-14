'use strict';
// Pacient
const addPacient = require('../Doctor/Pacient/addPacient');
const changePacientStatusToPending = require('../Doctor/Pacient/changePacientStatusToPending');
const getAllPacients = require('../Doctor/Pacient/getAllPacients');
const getAllPacientsForHospital = require('../Doctor/Pacient/getAllPacientsForHospital');
const resetPacientWaitingStatus = require('../Doctor/Pacient/resetPacientWaitingStatus');
// Pending
const createNewPending = require('../Doctor/Pending/createNewPending');

class DoctorService {

    // Pacient
    static async addPacient(identityName, name, surname, lbo, jmbg, city, hospitalCode, hospitalName) {
        const result = await addPacient(identityName, name, surname, lbo, jmbg, city, hospitalCode, hospitalName);
        return result;
    }

    static async changePacientStatusToPending(identityName, pacientLbo) {
        const result = await changePacientStatusToPending(identityName, pacientLbo);
        return result;
    }

    static async getAllPacients(identityName) {
        const result = await getAllPacients(identityName);
        return result;
    }

    static async getAllPacientsForHospital(identityName, hospitalCode) {
        const result = await getAllPacientsForHospital(identityName, hospitalCode);
        return result;
    }

    static async resetPacientWaitingStatus(identityName, pacientLbo) {
        const result = await resetPacientWaitingStatus(identityName, pacientLbo);
        return result;
    }

    // Pending 
    static async createNewPending(identityName, pacientLbo, pacientJmbg, patientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score, documentIds) {
        const result = await createNewPending(identityName, pacientLbo, pacientJmbg, patientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score, documentIds);
        return result;
    }
}

module.exports = DoctorService;