const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');

async function addNewDocumentId(identityName, pacientId, documentId) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updateResult;

    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacientPrivateData', pacientId);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        modeledPrivateData = new (PacientPrivateData)(jsonResult);

        modeledPrivateData.addNewDocumentId(documentId);

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacientPrivateData', modeledPrivateData.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updateResult = new (Boolean)(jsonResult);
            console.log(updateResult);
        }
    } else {
        console.log(`Error while updating Pacient private data.`);
    }
    gateway.disconnect();
    return updateResult;
};

module.exports = addNewDocumentId;

// addNewDocumentId().then(() => {
// }).catch((exception) => {
//     console.log('Updating Pacient private data failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });