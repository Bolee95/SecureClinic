const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingState = require('../../utils/js-smart-contact-waiting-status.js');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function addPacientToPending() {
    const identityName = process.argv[2];
    const pacientLbo = process.argv[3];
    const hospitalName = process.argv[4];
    const waitingListCode = process.argv[5];
    const hospitalCode = process.argv[6];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updatingResult;

    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        const pacient = new (Pacient)(jsonResult);

        pacient.setHospitalCode(hospitalCode);
        pacient.setHospitalName(hospitalName);
        pacient.setWaitingListCode(waitingListCode);
        pacient.setWaitingStatusPending();

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacient', pacient.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updatingResult = (Boolean)(jsonResult);
            console.log(updatingResult);
        } else {
            console.log(`Error while updating Pacient status to Pending..`);
        }
    } else {
        console.log(`Error while updating Pacient status to Pending..`);
    }
    gateway.disconnect();
    return updatingResult;
};

addPacientToPending().then(() => {
}).catch((exception) => {
    console.log('Updating pacient failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});