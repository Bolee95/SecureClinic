const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');

async function getHospital() {
    const identityName = process.argv[2];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.USER, IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledHospitals = [];

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
        console.log(`Error while retriving all hospitals...`);
    }
    gateway.disconnect();
    return modeledHospitals;
};

getHospital().then(() => {
}).catch((exception) => {
    console.log('Retriving hospitals failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});