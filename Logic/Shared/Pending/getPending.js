const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getPending(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getPending', [hospitalCode,ordinationCode,serviceCode,pacientLbo]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            let modeledPending = new (Pending)(jsonResult);

            gateway.disconnect();
            return modeledPending;
        } else {
            throw new Error(`Error while retriving pending with id ${hospitalCode + ':' + ordinationCode + ':' + serviceCode + ':' + pacientLbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    };
};  

module.exports = getPending;
