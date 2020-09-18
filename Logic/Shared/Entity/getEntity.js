const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getEntity(identityName, licenceId) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER, IdentityRole.TEHNICAL]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledEntity;

    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'getEntity', licenceId);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            modeledEntity = new (Entity)(jsonResult);
        } else {
            throw new Error(`Error while retriving entity with licenceId ${licenceId}...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledEntity;
};

module.exports = getEntity;