const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllHospitals(identityName) {
    let modeledHospitals = [];
    var gateway;

    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.USER, IdentityRole.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getAllHospitals');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
            let index = 0;
            while(index != null) {
                const hospitalElement = jsonResult[index];
                if (hospitalElement == undefined) {
                    index = null;
                } else {
                    const modeledHospital = new (Hospital)(hospitalElement);
                    modeledHospitals.push(modeledHospital);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all hospitals...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledHospitals;
};

module.exports = getAllHospitals;
