const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllAmmends(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmends = [];

    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmends');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
            let index = 0;
            while(index != null) {
                const ammendElement = jsonResult[index];
                if (ammendElement == undefined) {
                    index = null;
                } else {
                    const modeledAmmend = new (Ammend)(ammendElement);
                    modeledAmmends.push(modeledAmmend);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all ammends for hospital with HospitalCode ${hospitalCode}`);
        }
    } catch(error) {
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledAmmends;
};

module.exports = getAllAmmends;