const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addNewDocumentId(identityName, pacientLbo, documentsId) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updateResult;
    try {
        let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacientPrivateData', pacientLbo);
        if (bufferedResult.length > 0) {
            let jsonResult = JSON.parse(bufferedResult.toString());
            modeledPrivateData = new (PacientPrivateData)(jsonResult);

            let documents = documentsId.split(',');
            documents.forEach(documentId => {
                modeledPrivateData.addNewDocumentId(documentId);
            });
    
            bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacientPrivateData', modeledPrivateData.stringifyClass());
            if (bufferedResult.length > 0) {
                jsonResult = JSON.parse(bufferedResult.toString());
                updateResult = new (Boolean)(jsonResult);
            }
        } else {
            throw new Error(`Error while updating Pacient private data.`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return updateResult;
};

module.exports = addNewDocumentId;