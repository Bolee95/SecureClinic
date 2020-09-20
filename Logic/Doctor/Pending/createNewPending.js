const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createPending(identityName, pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score, documentIds) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);

        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        var documents = [];
        if (documentIds === "") {
            documents = [];
        } else {
            documents = documentIds.split(',');
        }

        const pending = Pending.createInstance(pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], false, score, documents);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'addPending', pending.stringifyClass());
        if (bufferedResult.length > 0) {
            // const jsonResult = JSON.parse(bufferedResult.toString());
            // let addingResult = (Boolean)(jsonResult);

            // if (addingResult === true) 
            // {
            gateway.disconnect();
            return pending;
            //}
        } else {
            throw new Error(`Error while creating new Pending...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createPending;