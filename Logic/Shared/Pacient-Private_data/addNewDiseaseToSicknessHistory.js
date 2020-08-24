const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const Disease = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/disease.js');

async function addNewDiseaseToSicknessHistory(identityName, pacientLbo, diseaseCode, diseaseName, isActive) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updateResult;

    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacientPrivateData', pacientLbo);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        modeledPrivateData = new (PacientPrivateData)(jsonResult);

        let newDisease = Disease.createInstance(diseaseCode, diseaseName, isActive);
        modeledPrivateData.addNewDiseaseCode(newDisease);

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacientPrivateData', modeledPrivateData.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updateResult = new (Boolean)(jsonResult);
            console.log(updateResult);
        }
    } else {
        console.log(`Error while updating Pacient private data with lbo ${pacientLbo}.`);
    }
    gateway.disconnect();
    return updateResult;
};

module.exports = addNewDiseaseToSicknessHistory;