const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addNewDocumentId(identityName, pacientLbo, documentsId) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();

        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);

        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

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
                const updateResult = new (Boolean)(jsonResult);

                gateway.disconnect();
                if (updateResult == true) {
                   return modeledPrivateData;
                } else {
                    throw new Error(`Error while adding new DocumentId to pacient with lbo ${pacientLbo}..`);
                }
            }
        } else {
            throw new Error(`Error while updating Pacient private data.`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = addNewDocumentId;