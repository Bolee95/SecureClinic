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
const addNewDiseaseToSicknessHistory = require('../Shared/Pacient-Private_data/addNewDiseaseToSicknessHistory');
const addPacientPrivateData = require('../Shared/Pacient-Private_data/addPacientPrivateData');
const getPacientPrivateData = require('../Shared/Pacient-Private_data/getPacientPrivateData');
const getAllPacientsPrivateData = require('../Shared/Pacient-Private_data/getAllPacientsPrivateData');
// Pending
const approvePending = require('../Shared/Pending/approvePending');
const getPending = require('../Shared/Pending/getPending');
const getAllPendings = require('../Shared/Pending/getAllPendings');
const getPendingsForHospital = require('../Shared/Pending/getPendingsForHospital');
// WaitingList
const createWaitingList = require('../Shared/WaitingList/createWaitingList');
const getAllPacientsForWaitingList = require('../Shared/WaitingList/getAllPacientsForWaitingList');
const getAllWaitingListsForHospital = require('../Shared/WaitingList/getAllWaitingListsForHospital');
const getWaitingList = require('../Shared/WaitingList/getWaitingList');
// Entity
const getEntity = require('../Shared/Entity/getEntity');
// Files
const uploadFile = require('../Shared/Files/writeFileToDbAPI');
const getFile = require('../Shared/Files/readFileFromDbAPI');
const uploadMultipleFiles = require('../Shared/Files/writeMultipleFiles');

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
    static async addNewDocumentId(identityName, pacientLbo, documentId) {
        const result = await addNewDocumentId(identityName, pacientLbo, documentId);
        return result;
    }

    static async addNewDiseaseToSicknessHistory(identityName, pacientLbo, diseaseCode, diseaseName, isActive) {
        const result = await addNewDiseaseToSicknessHistory(identityName, pacientLbo, diseaseCode, diseaseName, isActive);
        return result;
    }

    static async addPacientPrivateData(identityName, pacientLbo, cardId) {
        const result = await addPacientPrivateData(identityName, pacientLbo, cardId);
        return result;
    }

    static async getPacientPrivateData(identityName, pacientLbo) {
        const result = await getPacientPrivateData(identityName, pacientLbo);
        return result;
    }

    static async getAllPacientsPrivateData(identityName) {
        const result = await getAllPacientsPrivateData(identityName);
        return result;
    }

    // Pending
    static async approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
        const result = await approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo);
        return result;
    }

    static async getPending(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
        const result = await getPending(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo);
        return result;
    }

    static async getAllPendings(identityName) {
        const result = await getAllPendings(identityName);
        return result;
    }

    static async getPendingsForHospital(identityName, hospitalCode) {
        const result = await getPendingsForHospital(identityName, hospitalCode);
        return result;
    }

    // Waiting List
    static async createWaitingList(identityName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, maxWaitingDays) {
        const result = await createWaitingList(identityName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, maxWaitingDays);
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

    static async getWaitingList(identityName, hospitalCode, ordinationCode, serviceCode) {
        const result = await getWaitingList(identityName, hospitalCode, ordinationCode, serviceCode);
        return result;
    }
    // Entity
    static async getEntity(identityName, licenceId) {
        const result = await getEntity(identityName, licenceId);
        return result;
    }

    // Files
    static async uploadFile(identityName, file) {
        const result = await uploadFile(file);
        return result;
    }

    static async readFile(identityName, fileId) {
        const result = await getFile(fileId);
        return result;
    }

    static async uploadMultipleFiles(identityName, files) {
        const result = await uploadMultipleFiles(identityName, files);
        return result;
    }
}

module.exports = SharedService;