const SmartContractUtil = require('../utils/js-smart-contract-util.js');
const ApprovedPacient = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const WaitingList = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const Facility = require('../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');
const changePacientWaitingStatusToWaiting = require('./changePacientStatusToWaiting');

async function addPacientToWaitingList(gateway, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, pacientLbo, score) {
    let pacient;
    let waitingList;

    // WAITING LIST RETRIVAL
    const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, ordinationCode, serviceCode]);
    if (waitingListResult.length > 0) {
        const jsonResult = JSON.parse(waitingListResult.toString());
        waitingList = new (WaitingList)(jsonResult);
    } else {
        // Waiting list doesn't exist, create one   
        // TO-DO: Retrieve Service max time 
        const newWaitingList = WaitingList.createInstance(hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], 50);
        const createWaitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', newWaitingList.stringifyClass());
        if (createWaitingListResult.length > 0) {
            // Everything alright, can continue futher
        } 
        else {
            throw new Error(`Error while creating Waiting List with key ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
        }
    }
    // PACIENT RETRIVAL
    const pacientResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
    if (pacientResult.length > 0) {
        const jsonResult = JSON.parse(pacientResult.toString());
        pacient = new (Pacient)(jsonResult);
    } else {
        throw new Error(`Error while retrieving Pacient with lbo ${pacientLbo}...`);
    }
   
    // CREATING AND ADDING PACIENT TO WAITNG LIST
    let addedDate = Date.now();
    // TO-DO: Retrieve Service max time 
    let maxDate = addedDate + (86400000 * 60);
    const approvedPacient = ApprovedPacient.createInstance(pacient.lbo, pacient.getNameAndSurname(), pacient.city, addedDate, score, maxDate);
    waitingList.addNewPacient(approvedPacient);

    const updateResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'updateWaitingList', waitingList.stringifyClass());
    if (updateResult.length > 0) {
        const result = JSON.parse(updateResult.toString());
        if (result == true) {
            console.log(`New pacient with lbo ${pacientLbo} successfully added to waiting list with id ${waitingList.getKey()}!`);   
        } else {
            throw new Error(`Fail while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
        }
    } else {
        throw new Error(`Error while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
    }

    // UPDATING USER WAITING STATUS 
    await changePacientWaitingStatusToWaiting(gateway, pacientLbo, hospitalName, hospitalCode, ordinationCode, serviceCode);

    gateway.disconnect();   
    return true;
};

module.exports = addPacientToWaitingList;