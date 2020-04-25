'use strict';
// Ammend
const addNewEvidenceToAmmend = require('../Shared/Ammend/addNewEvidenceToAmmend');
const createAmmend = require('../Shared/Ammend/createAmmend');
const getAllAmmendsForHosptial = require('../Shared/Ammend/getAllAmmendsForHosptial');
const getAmmend = require('../Shared/Ammend/getAmmend');
const signAmmend = require('../Shared/Ammend/signAmmend');
// Hospital
const getAllHospitals = require('../Shared/Hospital/getAllHospitals');
const getHospital = require('../Shared/Hospital/getHospital');
// Pacient
const getPacient = require('../Shared/Pacient/getPacient');
// Pacient Private Data
const addNewDocumentId = require('../Shared/Pacient-Private_data/addNewDocumentId');
const addNewEntityToSickness = require('../Shared/Pacient-Private_data/addNewEntityToSickness');
const addPacientPrivateData = require('../Shared/Pacient-Private_data/addPacientPrivateData');
const getPacientPrivateData = require('../Shared/Pacient-Private_data/getPacientPrivateData');
// Pending
const approvePending = require('../Shared/Pending/approvePending');
const getPending = require('../Shared/Pending/getPending');
const getPendingsForHospital = require('../Shared/Pending/getPendingsForHospital');
// WaitingList
const createWaitingList = require('../Shared/WaitingList/createWaitingList');
const getAllPacientsForWaitingList = require('../Shared/WaitingList/getAllPacientsForWaitingList');
const getAllWaitingListsForHospital = require('../Shared/WaitingList/getAllWaitingListsForHospital');
const getWaitingList = require('../Shared/WaitingList/getWaitingList');

class SharedService {

    // Ammend
    async addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId) {
        const result = await addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId);
        return result;
    }

    async createAmmend(identityName, ammendId, hospitalCode, pacientJmbg, action, neededEndors, listId) {
        const result = await createAmmend(identityName, ammendId, hospitalCode, pacientJmbg, action, neededEndors, listId);
        return result;
    }

    async getAllAmmendsForHosptial(identityName, hospitalCode) {
        const result = await getAllAmmendsForHosptial(identityName, hospitalCode);
        return result;
    }

    async getAmmend(identityName, hospitalCode, ammendId) {
        const result = await getAmmend(identityName, hospitalCode, ammendId);
        return result;
    }

    async signAmmend(identityName, workingLicence, hospitalCode, ammendId) {
        const result = await signAmmend(identityName, workingLicence, hospitalCode, ammendId);
        return result;
    }

    // Hospital
    async getAllHospitals(identityName) {
        const result = await getAllHospitals(identityName);
        return result;
    }

    async getHospital(identityName, hospitalCode) {
        const result = await getHospital(identityName, hospitalCode);
        return result;
    }

    // Pacient
    async getPacient(identityName, pacientLbo) {
        const result = await getPacient(identityName, pacientLbo);
        return result;
    }

    // Pacient Private Data
    async addNewDocumentId(identityName, pacientId, documentId) {
        const result = await addNewDocumentId(identityName, pacientId, documentId);
        return result;
    }

    async addNewEntityToSickness(identityName, pacientId, deseaseCode) {
        const result = await addNewEntityToSickness(identityName, pacientId, deseaseCode);
        return result;
    }

    async addPacientPrivateData(identityName, uniqueId, cardId) {
        const result = await addPacientPrivateData(identityName, uniqueId, cardId);
        return result;
    }

    async getPacientPrivateData(identityName, pacientId) {
        const result = await getPacientPrivateData(identityName, pacientId);
        return result;
    }

    // Pending
    async approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const result = await approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo);
        return result;
    }

    async getPending(identityName, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const result = await getPending(identityName, hospitalCode, serviceCode, ordinationCode, pacientLbo);
        return result;
    }

    async getPendingsForHospital(identityName, hospitalCode) {
        const result = await getPendingsForHospital(identityName, hospitalCode);
        return result;
    }

    // Waiting List
    async createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }

    async getAllPacientsForWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await getAllPacientsForWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }

    async getAllWaitingListsForHospital(identityName, hospitalCode) {
        const result = await getAllWaitingListsForHospital(identityName, hospitalCode);
        return result;
    }

    async getWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await getWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }
}

module.exports = SharedService;