const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addPacientPrivateData(identityName, pacientLbo, cardId, screename) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();

        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        const privateData = PacientPrivateData.createInstance(pacientLbo, cardId, screename, [], []);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacientPrivateData', privateData.stringifyClass());
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const addingResult = jsonResult;
            
            gateway.disconnect();
            return privateData;
        } else {
            throw new Error(`Error while Adding Pacient private data with lbo ${pacientLbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = addPacientPrivateData;