const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');

async function addPacientPrivateData(identityName, pacientLbo, cardId, screename) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    const privateData = PacientPrivateData.createInstance(pacientLbo, cardId, screename, [], []);
    var addingResult;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacientPrivateData', privateData.stringifyClass());
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        addingResult = jsonResult;
        console.log(jsonResult);
    } else {
        console.log(`Error while Adding Pacient private data with lbo ${pacientLbo}...`);
    }
    gateway.disconnect();
    return addingResult;
};

module.exports = addPacientPrivateData;
// addPacientPrivateData().then(() => {
// }).catch((exception) => {
//     console.log('Adding Pacient private data failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });