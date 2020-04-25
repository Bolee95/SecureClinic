const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function getPending() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    const serviceCode = process.argv[4];
    const ordinationCode = process.argv[5];
    const pacientLbo = process.argv[6];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPending;
    //[hospitalCode,serviceCode,ordinationCode,pacientLbo]
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getPending', [hospitalCode,serviceCode,ordinationCode,pacientLbo]);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        modeledPending = new (Pending)(jsonResult);
        console.log(modeledPending);
    } else {
        console.log(`Error while retriving pending with id ${hospitalCode + ' ' + serviceCode + ' ' + ordinationCode + ' ' + pacientLbo}...`);
    }
    gateway.disconnect();
    return modeledPending;
};

getPending().then(() => {
}).catch((exception) => {
    console.log('Retriving pending failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});