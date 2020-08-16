const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function changePacientStatusToPending(identityName, pacientLbo) {
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

module.exports = changePacientStatusToPending;

// addPacientToPending().then(() => {
// }).catch((exception) => {
//     console.log('Updating pacient failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });