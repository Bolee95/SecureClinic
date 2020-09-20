const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getHospital(identityName, hospitalCode) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER, IdentityRole.TEHNICAL]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledHospital = new (Hospital)(jsonResult);

            gateway.disconnect();
            return modeledHospital;
        } else {
            throw new Error(`Error while retriving hospital with hospitalCode ${hospitalCode}...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = getHospital;