const SmartContractUtil = require('../utils/js-smart-contract-util.js');
const ApprovedPacient = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const WaitingList = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const Facility = require('../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');
const changePacientWaitingStatusToWaiting = require('./changePacientStatusToWaiting');

async function addPacientToWaitingList(gateway, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
    let pacient;
    let waitingList;
    let operationService;
    let pendingRemovalRes;

    // WAITING LIST RETRIVAL
    const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode,serviceCode,ordinationCode]);
    if (waitingListResult.length > 0) {
        const jsonResult = JSON.parse(waitingListResult.toString());
        waitingList = new (WaitingList)(jsonResult);
    } else {
        throw new Error(`Error while retrieving WaitingList with id ${hospitalCode}:${serviceCode}:${ordinationCode}...`)
    }
    // PACIENT RETRIVAL
    const pacientResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
    if (pacientResult.length > 0) {
        const jsonResult = JSON.parse(pacientResult.toString());
        pacient = new (Pacient)(jsonResult);
    } else {
        throw new Error(`Error while retrieving Pacient with lbo ${pacientLbo}...`);
    }
    // FACILITY RETRIVAL
    const facilityResult = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'getFacility', ordinationCode);
    if (facilityResult.length > 0) {
        const jsonResult = JSON.parse(facilityResult.toString());
        const modeledFacility = new (Facility)(jsonResult);

        for (const service of modeledFacility.getServices()) {
            const modeledService = new (Service)(service);
            if (modeledService.getServiceCode() == serviceCode) {
                operationService = modeledService;
                break;
            }
        }

        if (operationService == undefined) {
            throw new Error(`There is no service with id ${serviceCode} for facility code ${ordinationCode}`);
        }
    }
    // CREATING AND ADDING PACIENT TO WAITNG LIST
    const approvedPacient = ApprovedPacient.createInstance(pacient.uniqueId,pacient.city,Date.now(), operationService.getMaxWaitingTime() ,5);
    waitingList.addNewPacient(approvedPacient);

    const updateResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'updateWaitingList', waitingList.stringifyClass());
    if (updateResult.length > 0) {
        const result = JSON.parse(updateResult.toString());
        if (result == true) {
            console.log(`New pacient with lbo ${pacientLbo} successfully added to waiting list with id ${waitingList.getKey()}!`);   
        } else {
            console.log(`Fail while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
        }
    } else {
        console.log(`Error while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
    }

    // REMOVING PENDING
    const pendingRemovalResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'removePending', [hospitalCode, serviceCode, ordinationCode, pacientLbo]);
    if (updateResult.length > 0) {
        pendingRemovalRes = JSON.parse(pendingRemovalResult.toString());
        if (pendingRemovalRes == true) {
            console.log(`Removal of pending with id ${hospitalCode}:${serviceCode}:${ordinationCode}:${pacientLbo} successful.`);
        } else {
            console.log(`Error while removing pending with id ${hospitalCode}:${serviceCode}:${ordinationCode}:${pacientLbo} failed...`);
        }
    }

    // UPDATING USER WAITING STATUS 
    changePacientWaitingStatusToWaiting(gateway, pacientLbo, hospitalCode, waitingList.key, hospitalCode);

    gateway.disconnect();   
    return pendingRemovalRes;
};

module.exports = addPacientToWaitingList;