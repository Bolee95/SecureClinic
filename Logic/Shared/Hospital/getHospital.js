const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getHospital(identityName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER, IdentityRole.TEHNICAL]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledHospital;
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledHospital = new (Hospital)(jsonResult);
        } else {
            throw new Error(`Error while retriving hospital with hospitalCode ${hospitalCode}...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledHospital;
};

module.exports = getHospital;