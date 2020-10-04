const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function deletePacient(identityName, pacientLbo) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        let deletetingResult;

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'removePacient', pacientLbo);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            deletetingResult = (Boolean)(jsonResult);

            gateway.disconnect();
            return deletetingResult;
        } else {
            throw new Error(`Error while deleting pacient with lbo ${pacientLbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = deletePacient;
