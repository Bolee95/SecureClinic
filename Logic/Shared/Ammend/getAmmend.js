const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmend;
    
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode, ordinationCode, serviceCode, pacientLbo]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            modeledAmmend = new (Ammend)(jsonResult);
        } else {
            throw new Error(`Error while retriving ammend with id ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}.`);
        }
    } catch(error) {
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledAmmend;
};

module.exports = getAmmend;