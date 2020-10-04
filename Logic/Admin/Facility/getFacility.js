const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');

async function getFacility(identityName, facilityCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    let modeledFacility;
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'getFacility', facilityCode);
    if (bufferedResult.length > 0) {
        const facility = JSON.parse(bufferedResult.toString());
        modeledFacility = new (Facility)(facility);
    }  
    gateway.disconnect();   
    return modeledFacility;
};

module.exports = getFacility;