const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function deletePacient(identityName, pacientLbo) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let deletetingResult;

    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'removePacient', pacientLbo);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            deletetingResult = (Boolean)(jsonResult);
        } else {
            throw new Error(`Error while deleting pacient with lbo ${pacientLbo}...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return deletetingResult;
};

module.exports = deletePacient;
