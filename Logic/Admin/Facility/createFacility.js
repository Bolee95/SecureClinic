const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');

async function createFacility(identityName, facilityName, facilityCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const facility = Facility.createInstance(facilityName, facilityCode,[]);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'addFacility', facility.stringifyClass());
    if (bufferedResult.length > 0) {
        console.log(facility.getFacilityName());
    } else {
        console.log(`Error while creating Facility...`);
    }  
    gateway.disconnect();   
};

module.exports = createFacility;

// createFacility().then(() => {
// }).catch((exception) => {
//     console.log('Creating new facility failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });