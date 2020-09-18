const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllHospitals(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.USER, IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledHospitals = [];

    try {
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

            console.log(modeledHospitals);
        } else {
            throw new Error(`Error while retriving all hospitals...`);
        }
    } catch(error) {
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledHospitals;
};

module.exports = getAllHospitals;
