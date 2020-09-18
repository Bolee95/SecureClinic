const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllEntities(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    var modeletedEntities = [];
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'getAllEntities');
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const entityElement = jsonResult[index];
                if (entityElement == undefined) {
                    index = null;
                } else {
                    const modeledEntity = new (Entity)(entityElement);
                    modeletedEntities.push(modeledEntity);
                    index++;
               }    
            };

        } else {
            throw new Error(`Error while reading all entities...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeletedEntities;
};

module.exports = getAllEntities;