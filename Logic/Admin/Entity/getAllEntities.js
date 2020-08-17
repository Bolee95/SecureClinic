const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity');

async function getAllEntities(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'getAllEntities');
    let entityArray;
    if (bufferedResult.length > 0) {
        entityArray = JSON.parse(bufferedResult.toString());
        console.log(entityArray);
    } else {
        console.log(`Error while reading all entities...`);
    }
    gateway.disconnect();
    return entityArray;
};

module.exports = getAllEntities;