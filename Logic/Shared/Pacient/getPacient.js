const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getPacient(identityName, pacientLbo) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledPacient = new (Pacient)(jsonResult);
            
            gateway.disconnect();
            return modeledPacient;
        } else {
            throw new Error(`Error while retriving pacient with lbo ${pacientLbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = getPacient;