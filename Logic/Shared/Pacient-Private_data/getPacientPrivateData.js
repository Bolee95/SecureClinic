const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getPacientPrivateData(identityName, pacientLbo) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);

        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
       
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacientPrivateData', pacientLbo);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledPrivateData = new (PacientPrivateData)(jsonResult);

            gateway.disconnect();
            return modeledPrivateData;
        } else {
            throw new Error(`Error while retrieving Pacient private data. Probably there is no data for lbo ${pacientLbo}`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = getPacientPrivateData;