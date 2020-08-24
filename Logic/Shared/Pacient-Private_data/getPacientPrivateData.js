const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');

async function getPacientPrivateData(identityName, pacientLbo) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPrivateData;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacientPrivateData', pacientLbo);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        modeledPrivateData = new (PacientPrivateData)(jsonResult);
        console.log(modeledPrivateData);
    } else {
        console.log(`Error while retrieving Pacient private data. Probably there is no data for lbo ${pacientLbo}`);
    }
    gateway.disconnect();
    return modeledPrivateData;
};

module.exports = getPacientPrivateData;
// getPacientPrivateData().then(() => {
// }).catch((exception) => {
//     console.log('Retrieving Pacient private data failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });