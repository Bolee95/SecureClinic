const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const waitingList = WaitingList.createInstance(hospitalCode,serviceCode,ordinationCode,[]);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', waitingList.stringifyClass());
    if (bufferedResult.length > 0) {
        console.log(waitingList.getHospitalCode() + ' ' + waitingList.getServiceCode());
    } else {
        console.log(`Error while creating new WaitingList...`);
    }
    gateway.disconnect();
};

module.exports = createWaitingList;
// createWaitingList().then(() => {
// }).catch((exception) => {
//     console.log('Creating new waiting list failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });