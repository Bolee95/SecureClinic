const IdentityRole = require ('../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../utils/js-smart-contract-util');
const Hospital = require('../../Chaincodes with statesAPI/HospitalContract/lib/hospital.js');

async function createHospital() {

    const identityName = process.argv[2];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    //const dummyHospital = Hospital.createInstance('Test Bolnica #3','ABBA', true,'Nis',[],[],[]);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'addHospital', ['test','test1','test2']);//dummyHospital);
    if (bufferedResult.length > 0) {
        let hospital = Hospital.deserialize(bufferedResult);
        console.log(hospital.getHospitalName());
    } else {
        console.log(`Check if Hospital is created...`);
    }
   
    gateway.disconnect();
    
};

createHospital().then(() => {
}).catch((exception) => {
    console.log('Creating new hospital failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
    console.log('CreateHospital function ended');
});