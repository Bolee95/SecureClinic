const SmartContractUtil = require('../../utils/js-smart-contract-util.js'); 
const ApprovedPacient = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function addPacientToWaitingListTest(pacientLbo, name, surname) {
    let waitingList;
    let adminIdName = 'admin';
    
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, adminIdName);
    //await SmartContractUtil.checkIdentityNameWithRole(adminIdName, [IdentityRole.ADMIN]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, adminIdName);

    // WAITING LIST RETRIVAL
    const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', ['AA', 'BB', 'CC']);
    if (waitingListResult.length > 0) {
        const jsonResult = JSON.parse(waitingListResult.toString());
        waitingList = new (WaitingList)(jsonResult);
    } else {
        // Waiting list doesn't exist, create one   
        // TO-DO: Retrieve Service max time 
        waitingList = WaitingList.createInstance('Test bolnica', 'Test ordinacija', 'Test servis', 'AA', 'BB', 'CC', [], 50);
        const createWaitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', newWaitingList.stringifyClass());
        if (createWaitingListResult.length > 0) {
            // Everything alright, can continue futher
        } 
        else {
            throw new Error(`Error while creating Waiting List with key ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
        }
    }

    // CREATING AND ADDING PACIENT TO WAITNG LIST
    let addedDate = Date.now();
    // TO-DO: Retrieve Service max time 
    let maxDate = addedDate + (86400000 * 50);
    const approvedPacient = ApprovedPacient.createInstance(pacientLbo, name + ' ' + surname, 'Nis', addedDate, 10, maxDate);
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
        throw new Error(`Error while adding pacient with lbo ${pacientLbo} to waiting list with id ${waitingList.getKey()}...`);
    }

    // UPDATING USER WAITING STATUS 

    gateway.disconnect();   
    return true;
};

module.exports = addPacientToWaitingListTest;