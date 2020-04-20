const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util.js');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const Facility = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/facility.js');
const Service = require('../../../ChaincodeWithStatesAPI/FacilityContract/lib/service.js');

async function addNewOrdinationToHospital() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    const ordinationCode = process.argv[4];

     // Using Utility class to setup everything
     const fabricWallet = await SmartContractUtil.getFileSystemWallet();
     // Check if user exists in wallets
     await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
     await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
     // Connecting to Gateway
     const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

     const ordination = await SmartContractUtil.submitTransaction(gateway, 'Facility', 'getFacility', ordinationCode);
     const hospital = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
     if(hospital.length > 0 && ordination.length > 0) {
        const modeledHospital = Hospital.deserialize(hospital, Hospital);
        const modeledOrdination = Facility.deserialize(ordination, Facility);

        modeledHospital.addNewOrdination(modeledOrdination);

        await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'updateHospital', modeledHospital.stringifyClass());
     }

     gateway.disconnect();
};

addNewOrdinationToHospital().then(() => {

}).catch((exception) => {
    console.log('Adding new ordination to Hospital failed...Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {

});