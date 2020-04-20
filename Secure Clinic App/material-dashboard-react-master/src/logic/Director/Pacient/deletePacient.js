const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function deletePacient() {
    const identityName = process.argv[2];
    const pacientLbo = process.argv[3];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let deletetingResult;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'removePacient', pacientLbo);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        deletetingResult = (Boolean)(jsonResult);
        console.log(deletePacient);
    } else {
        console.log(`Error while deleting pacient with lbo ${pacientLbo}...`);
    }
    gateway.disconnect();
    return deletetingResult;
};

deletePacient().then(() => {
}).catch((exception) => {
    console.log('Deleting pacient failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});