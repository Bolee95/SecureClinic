const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function retrieveAllAmmends(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmends = [];
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmends');
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const ammendElement = jsonResult[index];
                if (ammendElement == undefined) {
                    index = null;
                } else {
                    const modeledAmmmend = new (Ammend)(ammendElement);
                    modeledAmmends.push(modeledAmmmend);
                    index++;
               }    
            };

        } else {
            return new Error("Error while retrieving all Ammends...");
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledAmmends; 
};

module.exports = retrieveAllAmmends;