const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'getFacility', facilityCode);
        if (bufferedResult.length > 0) {
            const facility = JSON.parse(bufferedResult.toString());
            modeledFacility = new (Facility)(facility);

            let newService = Service.createInstance(serviceCode, serviceName, maxWaitTime);
            modeledFacility.addService(newService);

            const updateResult = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'updateFacility', modeledFacility.stringifyClass());
            if (updateResult.length > 0) {
                const result = JSON.parse(updateResult.toString());
                if (result == true) {
                    return modeledFacility;
                }
            } else {
                throw new Error(`Error while updating Facility with new service...`);
            }
        } else {
            throw new Error(`Error while retrieving facility with code ${facilityCode}`);
        }  
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }   
    gateway.disconnect();   
};

module.exports = addServiceToFacility;
