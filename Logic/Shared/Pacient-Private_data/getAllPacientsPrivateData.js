const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllPacientsPrivateData(identityName) {
    var gateway;
    let modeledPacientsPrivateData = [];
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
   
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getAllPacientsPrivateData');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const privateDataElement = jsonResult[index];
                if (privateDataElement == undefined) {
                    index = null;
                } else {
                    const modeledPrivateData = new (PacientPrivateData)(privateDataElement);
                    modeledPacientsPrivateData.push(modeledPrivateData);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all pacients private data...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledPacientsPrivateData;
};

module.exports = getAllPacientsPrivateData;