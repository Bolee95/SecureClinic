const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllPacients(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPacients = [];
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getAllPacients');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const pacientElement = jsonResult[index];
                if (pacientElement == undefined) {
                    index = null;
                } else {
                    const modeledPacient = new (Pacient)(pacientElement);
                    modeledPacients.push(modeledPacient);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all pacients...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledPacients;
};

module.exports = getAllPacients;