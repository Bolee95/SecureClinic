const SmartContractUtil = require('../utils/js-smart-contract-util.js');
const ApprovedPacient = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const WaitingList = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const changePacientWaitingStatusToWaiting = require('./changePacientStatusToWaiting');
const { ordinations } = require('../resources/Ordinations');


async function addPacientToWaitingList(gateway, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, pacientLbo, score) {
    let pacient;
    let waitingList;

    // For now in static data
    let maxWaitingTime = getMaxWaitingTimeForService(serviceCode);

    // WAITING LIST RETRIVAL
    const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, ordinationCode, serviceCode]);
    if (waitingListResult.length > 0) {
        const jsonResult = JSON.parse(waitingListResult.toString());
        waitingList = new (WaitingList)(jsonResult);
    } else {
        // Waiting list doesn't exist, create one   
        waitingList = WaitingList.createInstance(hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], maxWaitingTime);
        const createWaitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', waitingList.stringifyClass());
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
    let maxDate = addedDate + (86400000 * maxWaitingTime);
    const approvedPacient = ApprovedPacient.createInstance(pacient.lbo, pacient.getNameAndSurname(), pacient.city, addedDate, score, maxDate);
    waitingList.addNewPacient(approvedPacient);

    const updateResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'updateWaitingList', waitingList.stringifyClass());
    if (updateResult.length > 0) {
        const result = JSON.parse(updateResult.toString());
        if (result == true) {
        } else {
            throw new Error(`Fail while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
        }
    } else {
        throw new Error(`Error while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
    }

    // UPDATING USER WAITING STATUS 
    let result = await changePacientWaitingStatusToWaiting(gateway, pacientLbo, hospitalName, hospitalCode, ordinationCode, serviceCode);
    return result;
};

function getMaxWaitingTimeForService(serviceCode) {
    for (let index = 0; index < ordinations.length; index++) {
        let ordinationItem = ordinations[index];

        var services = [];

        for(let index = 0; index < ordinationItem.services.length; index++) {
            let serviceItem = ordinationItem.services[index];
            let service = {
                "name": serviceItem['serviceName'],
                "code": serviceItem['serviceCode'],
                "waitingTime": serviceItem['waitingTime']
            };
            services.push(service);
        }

        let selectedService = services.find(service => service["code"] === serviceCode);
        if (selectedService === undefined) {
            return 60;
        } else {
            return selectedService['waitingTime'];
        }
    }
}

module.exports = addPacientToWaitingList;