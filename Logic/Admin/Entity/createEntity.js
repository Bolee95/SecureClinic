const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity.js');

async function createEntity(identityName, licenceId, role, name, surname, hospitalName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
    const entity = Entity.createInstance(licenceId, role, name, surname, hospitalName, hospitalCode);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'addEntity', entity.stringifyClass());
    if (bufferedResult.length > 0) {
        gateway.disconnect();   
        return true;
    } else {
        throw new Error(`Error while creating Entity ${entity.getLicenceId()}...`);
    }  
    
};

module.exports = createEntity;
