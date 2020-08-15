'use strict';
// Shared
const login = require('../Shared/login');
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

    // Shared
    static async login(userId) {
        const result = await login(userId);
        return result;
    }

    // Ammend
    static async addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId) {
        const result = await addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId);
        return result;
    }

    static async createAmmend(identityName, ammendId, hospitalCode, pacientJmbg, action, neededEndors, listId) {
        const result = await createAmmend(identityName, ammendId, hospitalCode, pacientJmbg, action, neededEndors, listId);
        return result;
    }

    static async getAllAmmendsForHosptial(identityName, hospitalCode) {
        const result = await getAllAmmendsForHosptial(identityName, hospitalCode);
        return result;
    }

    static async getAmmend(identityName, hospitalCode, ammendId) {
        const result = await getAmmend(identityName, hospitalCode, ammendId);
        return result;
    }

    static async signAmmend(identityName, workingLicence, hospitalCode, ammendId) {
        const result = await signAmmend(identityName, workingLicence, hospitalCode, ammendId);
        return result;
    }

    // Hospital
    static async getAllHospitals(identityName) {
        const result = await getAllHospitals(identityName);
        return result;
    }

    static async getHospital(identityName, hospitalCode) {
        const result = await getHospital(identityName, hospitalCode);
        return result;
    }

    // Pacient
    static async getPacient(identityName, pacientLbo) {
        const result = await getPacient(identityName, pacientLbo);
        return result;
    }

    // Pacient Private Data
    static async addNewDocumentId(identityName, pacientId, documentId) {
        const result = await addNewDocumentId(identityName, pacientId, documentId);
        return result;
    }

    static async addNewEntityToSickness(identityName, pacientId, deseaseCode) {
        const result = await addNewEntityToSickness(identityName, pacientId, deseaseCode);
        return result;
    }

    static async addPacientPrivateData(identityName, uniqueId, cardId) {
        const result = await addPacientPrivateData(identityName, uniqueId, cardId);
        return result;
    }

    static async getPacientPrivateData(identityName, pacientId) {
        const result = await getPacientPrivateData(identityName, pacientId);
        return result;
    }

    // Pending
    static async approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const result = await approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo);
        return result;
    }

    static async getPending(identityName, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const result = await getPending(identityName, hospitalCode, serviceCode, ordinationCode, pacientLbo);
        return result;
    }

    static async getPendingsForHospital(identityName, hospitalCode) {
        const result = await getPendingsForHospital(identityName, hospitalCode);
        return result;
    }

    // Waiting List
    static async createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }

    static async getAllPacientsForWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await getAllPacientsForWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }

    static async getAllWaitingListsForHospital(identityName, hospitalCode) {
        const result = await getAllWaitingListsForHospital(identityName, hospitalCode);
        return result;
    }

    static async getWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
        const result = await getWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
        return result;
    }
}

module.exports = SharedService;