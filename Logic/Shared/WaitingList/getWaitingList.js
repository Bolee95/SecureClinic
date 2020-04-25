const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function getWaitingList() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    const serviceCode = process.argv[4];
    const ordinationCode = process.argv[5];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledWaitingList;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, serviceCode, ordinationCode]);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        modeledWaitingList = new (WaitingList)(jsonResult);
        console.log(modeledWaitingList);
    } else {
        console.log(`Error while retrieving WaitingList...`);
    }
    gateway.disconnect();
    return modeledWaitingList;
};

getWaitingList().then(() => {
}).catch((exception) => {
    console.log('Retrieving waiting list failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});