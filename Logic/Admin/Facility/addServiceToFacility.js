const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');

async function addServiceToFacility() {
    const identityName = process.argv[2];
    const facilityCode = process.argv[3];
    const serviceCode = process.argv[4];
    const serviceName = process.argv[5];
    const maxWaitTime = process.argv[6];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

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
                console.log(`New service ${serviceCode} to Facility with code ${facilityCode} successfully added!`);   
            }
        } else {
            console.log(`Error while updating Facility with new service...`);
        }
    } else {
        throw new Error(`Error while retrieving facility with code ${facilityCode}`);
    }  
    gateway.disconnect();   
};

addServiceToFacility().then(() => {
}).catch((exception) => {
    console.log('Updating facility failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});