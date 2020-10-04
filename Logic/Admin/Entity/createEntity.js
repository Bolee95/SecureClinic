const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createEntity(identityName, licenceId, role, name, surname, hospitalName, hospitalCode) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        
        const entity = Entity.createInstance(licenceId, role, name, surname, hospitalName, hospitalCode);
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'addEntity', entity.stringifyClass());
        if (bufferedResult.length > 0) { 
            gateway.disconnect();  
            return entity;
        } else {
            throw new Error(`Error while creating Entity ${entity.getLicenceId()}...`);
        }  
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createEntity;
