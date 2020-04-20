const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const AcceptedPacient = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');

async function getAllPacientsForWaitingList() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    const serviceCode = process.argv[4];
    const ordinationCode = process.argv[5];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAcceptedPacients = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, serviceCode, ordinationCode]);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        let modeledWaitingList = new (WaitingList)(jsonResult);

        for (const pacient of modeledWaitingList.getAllPacients()) {
            const acceptedPacient = new (AcceptedPacient)(pacient);
            modeledAcceptedPacients.push(acceptedPacient);
        }

        console.log(modeledAcceptedPacients);
    } else {
        console.log(`Error while retriving all pacients for waiting list with HospitalCode ${hospitalCode} ServiceCode ${serviceCode} OrdinationCode ${ordinationCode}`);
    }
    gateway.disconnect();
    return modeledAcceptedPacients;
};

getAllPacientsForWaitingList().then(() => {
}).catch((exception) => {
    console.log('Retriving pacients of Waiting List failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});