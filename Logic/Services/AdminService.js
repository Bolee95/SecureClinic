'use strict';
// Ammands
const importAmmends = require('../Admin/Ammand/retrieveAllAmmends');
// Facility
const addServiceToFacility = require('../Admin/Facility/addServiceToFacility');
const createFacility = require('../Admin/Facility/createFacility');
const getFacility = require('../Admin/Facility/getFacility');
// Hospital
const addNewOrdiantionToHospital = require('../Admin/Hospital/addNewOrdiantionToHospital');
const addNewServiceToHospital = require('../Admin/Hospital/addNewServiceToHospital');
const createHospital = require('../Admin/Hospital/createHospital');
// Network
const registerUser = require('../Admin/Network/registerUser');
const removeUser = require('../Admin/Network/removeUser');
// Pending
const retrieveAllPendings = require('../Admin/Pending/retrieveAllPendings');

class AdminService {
    // Ammands
    async retrieveAllAmmends(identityName) {
        const result = await importAmmends(identityName);
        return result;
    }

    // Facility
    async addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime) {
        const result = await addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime);
        return result;
    }

    async createFacility(identityName, facilityName, facilityCode) {
        const result = await createFacility(identityName, facilityName, facilityCode);
        return result;
    }

    async getFacility(identityName, facilityCode) {
        const result = await getFacility(identityName, facilityCode);
        return result;
    }

    // Hospital
    async addNewOrdiantionToHospital(identityName, hospitalCode, ordinationCode) {
        const result = await addNewOrdiantionToHospital(identityName, hospitalCode, ordinationCode);
        return result;
    }

    async addNewServiceToHospital() {
        const result = await addNewServiceToHospital(identityName, hospitalCode, serviceCode);
        return result;
    }

    async createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city) {
        const result = await createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city);
        return result;
    }

    //Network
    async registerUser(identityName, userName) {
        const result = await registerUser(identityName, userName);
        return result;
    }

    async removeUser(identityName, userName) {
        const result = await removeUser(identityName,userName);
        return result;
    }

    // Pending
    async retrieveAllPendings(identityName) {
        const result = await retrieveAllPendings(identityName);
        return result;
    }
}

module.exports = AdminService;