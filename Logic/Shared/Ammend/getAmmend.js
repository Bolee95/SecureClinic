const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function getAmmend() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    const ammendId = process.argv[4];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmend;
    //[hospitalCode,serviceCode,ordinationCode,pacientLbo]
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode, ammendId]);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        modeledAmmend = new (Ammend)(jsonResult);
        console.log(modeledAmmend);
    } else {
        console.log(`Error while retriving ammend with id ${hospitalCode + ':' + ammendId}...`);
    }
    gateway.disconnect();
    return modeledAmmend;
};

getAmmend().then(() => {
}).catch((exception) => {
    console.log('Retriving ammend failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});