const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode, ordinationCode, serviceCode, pacientLbo]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledAmmend = new (Ammend)(jsonResult);

            gateway.disconnect();
            return modeledAmmend;
        } else {
            throw new Error(`Error while retriving ammend with id ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}.`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
};

module.exports = getAmmend;