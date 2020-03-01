const IdentityRole = require ('../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../utils/js-smart-contract-util');
const Ammend = require('../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');

async function retrieveAllAmmends() {

    const identityName = process.argv[2];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmends');
    if (bufferedResult.length > 0) {
        const ammendArray = JSON.parse(bufferedResult.toString());
        const firstAmmend = new (Ammend)(ammendArray[0]);
        console.log(ammendArray);
        return ammendArray;
    } else {
        console.log(`Error while reading all ammends...`);
    }
    gateway.disconnect();
};

retrieveAllAmmends().then(() => {
}).catch((exception) => {
    console.log('Retriving pendings failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});