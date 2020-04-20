const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function getPacient() {
    const identityName = process.argv[2];
    const pacientLbo = process.argv[3];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPacient;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        modeledPacient = new (Pacient)(jsonResult);
        console.log(modeledPacient);
    } else {
        console.log(`Error while retriving pacient with lbo ${pacientLbo}...`);
    }
    gateway.disconnect();
    return modeledPacient;
};

getPacient().then(() => {
}).catch((exception) => {
    console.log('Retriving pacient failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});