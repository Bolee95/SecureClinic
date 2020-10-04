'use strict';
// Ammands
const importAmmends = require('../Admin/Ammand/retrieveAllAmmends');
// Facility
const addServiceToFacility = require('../Admin/Facility/addServiceToFacility');
const createFacility = require('../Admin/Facility/createFacility');
const getFacility = require('../Admin/Facility/getFacility');
// Hospital
const addNewOrdiantionToHospital = require('../Admin/Hospital/addNewOrdiantionToHospital');
//const addNewServiceToHospital = require('../Admin/Hospital/addNewServiceToHospital');
const createHospital = require('../Admin/Hospital/createHospital');
const addNewServiceToHospital = require('../Admin/Hospital/addNewOrdinationAndServiceToHospital');
// Network
const registerUser = require('../Admin/Network/registerUser');
const removeUser = require('../Admin/Network/removeUser');
// Pending
const retrieveAllPendings = require('../Admin/Pending/retrieveAllPendings');
// Entity
const getAllEntities = require('../Admin/Entity/getAllEntities');
const createEntity = require('../Admin/Entity/createEntity');

class AdminService {
    // Ammands
    static async retrieveAllAmmends(identityName) {
        const result = await importAmmends(identityName);
        return result;
    }

    // Facility
    static async addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime) {
        const result = await addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime);
        return result;
    }

    static async createFacility(identityName, facilityName, facilityCode) {
        const result = await createFacility(identityName, facilityName, facilityCode);
        return result;
    }

    static async getFacility(identityName, facilityCode) {
        const result = await getFacility(identityName, facilityCode);
        return result;
    }

    // Hospital
    static async addNewOrdiantionToHospital(identityName, hospitalCode, ordinationCode) {
        const result = await addNewOrdiantionToHospital(identityName, hospitalCode, ordinationCode);
        return result;
    }

    static async addNewServiceToHospital(identityName, hospitalCode, ordinationName, ordinationCode, serviceName, serviceCode) {
        const result = await addNewServiceToHospital(identityName, hospitalCode, ordinationName, ordinationCode, serviceName, serviceCode);
        return result;
    }

    static async createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city) {
        const result = await createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city);
        return result;
    }

    //Network
    static async registerUser(identityName, userName) {
        const result = await registerUser(identityName, userName);
        return result;
    }

    static async removeUser(identityName, userName) {
        const result = await removeUser(identityName,userName);
        return result;
    }

    // Pending
    static async retrieveAllPendings(identityName) {
        const result = await retrieveAllPendings(identityName);
        return result;
    }

    // Entity 
    static async getAllEntities(identityName) {
        const result = await getAllEntities(identityName);
        return result;
    }

    static async createEntity(identityName, licenceId, name, surname, hospitalName, hospitalCode, role) {
        const result = await createEntity(identityName, licenceId, role, name, surname, hospitalName, hospitalCode);
        return result;
    }
}

module.exports = AdminService;