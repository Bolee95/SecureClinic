const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util.js');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');

async function addNewServiceToHospital(identityName, hospitalCode, serviceCode) {
    // Using Utility class to setup everythingdD
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    let serviceAdded = false;
    let modeledHospital;
    const hospital = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
    if(hospital.length > 0) {
        modeledHospital = Hospital.deserialize(hospital, Hospital);
        const ordinations = modeledHospital.getListOfOrdinations();
        for (let ordination of ordinations) {
            let ordinationInstance = new (Facility)(ordination);
            const services = ordinationInstance.getServices();
            for(let service of services) {
                if (serviceCode == service.serviceCode) {
                    const modeledService = new (Service)(service);
                    modeledHospital.addNewService(modeledService);
                    serviceAdded = true;
                    break;
                }
            }
        }
    }

    if (serviceAdded) {
        await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'updateHospital', modeledHospital.stringifyClass());
        console.log('New service added!');
    } else {
        console.log('Service is not added!');
    }
    gateway.disconnect();
};

module.exports = addNewServiceToHospital;

// addNewServiceToHospital().then(() => {
// }).catch((exception) => {
//     console.log('Adding new service to Hospital failed...Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });