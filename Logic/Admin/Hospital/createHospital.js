const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');

async function createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const hospital = Hospital.createInstance(hospitalName,hospitalCode,privateOrPublic,city,[],[],[]);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'addHospital', hospital.stringifyClass());
    if (bufferedResult.length > 0) {
        console.log(hospital.getHospitalName());
    } else {
        console.log(`Error while creating Hospital...`);
    }  
    gateway.disconnect();   
};

module.exports = createHospital;

// createHospital().then(() => {
// }).catch((exception) => {
//     console.log('Creating new hospital failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
//     //console.log('CreateHospital function ended');
// });