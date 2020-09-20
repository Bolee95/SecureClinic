const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const Disease = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/disease.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addNewDiseaseToSicknessHistory(identityName, pacientLbo, diseaseCode, diseaseName, isActive) {
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

            let newDisease = Disease.createInstance(diseaseCode, diseaseName, isActive);
            modeledPrivateData.addNewDiseaseCode(newDisease);

            bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacientPrivateData', modeledPrivateData.stringifyClass());
            if (bufferedResult.length > 0) {
                jsonResult = JSON.parse(bufferedResult.toString());
                const updateResult = new (Boolean)(jsonResult);

                gateway.disconnect();
                if (updateResult == true) {
                    return modeledPrivateData;
                } else {
                    throw new Error(`Error while adding new Disease to pacient with lbo ${pacientLbo}.`);
                }
            }
        } else {
            throw new Error(`Error while updating Pacient private data with lbo ${pacientLbo}.`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = addNewDiseaseToSicknessHistory;