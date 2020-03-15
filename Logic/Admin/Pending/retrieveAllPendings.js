const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function retrieveAllPendings() {

    const identityName = process.argv[2];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendings');
    let pendingArray;
    if (bufferedResult.length > 0) {
        pendingArray = JSON.parse(bufferedResult.toString());
        const firstPending = new (Pending)(pendingArray[0]);
        const approvers = firstPending.getApprovers();
        console.log(pendingArray);
    } else {
        console.log(`Error while reading all pendings...`);
    }
    gateway.disconnect();
    return pendingArray;
};

retrieveAllPendings().then(() => {
}).catch((exception) => {
    console.log('Retriving pendings failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});