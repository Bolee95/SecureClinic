const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        const hospital = Hospital.createInstance(hospitalName,hospitalCode,privateOrPublic,city,[],[],[]);
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'addHospital', hospital.stringifyClass());
        if (bufferedResult.length > 0) {
            gateway.disconnect();   
            return hospital;
        } else {
            throw new Error(`Error while creating Hospital...`);
        }  
    } catch(error) {
        gateway.disconnect();
        ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createHospital;