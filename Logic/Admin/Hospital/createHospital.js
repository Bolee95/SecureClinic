const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const hospital = Hospital.createInstance(hospitalName,hospitalCode,privateOrPublic,city,[],[],[]);
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'addHospital', hospital.stringifyClass());
        if (bufferedResult.length > 0) {
            return hospital;
        } else {
            throw new Error(`Error while creating Hospital...`);
        }  
    } catch(error) {
        ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();   
};

module.exports = createHospital;