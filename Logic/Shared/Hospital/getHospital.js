const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');

async function getHospital(identityName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER, IdentityRole.TEHNICAL]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledHospital;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        const modeledHospital = new (Hospital)(jsonResult);
        console.log(modeledHospital);
    } else {
        console.log(`Error while retriving hospital with hospitalCode ${hospitalCode}...`);
    }
    gateway.disconnect();
    return modeledHospital;
};

module.exports = getHospital;
// getHospital().then(() => {
// }).catch((exception) => {
//     console.log('Retriving hospital failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });