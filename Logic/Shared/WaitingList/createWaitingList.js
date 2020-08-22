const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function createWaitingList(identityName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, maxWaitingDays) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const waitingList = WaitingList.createInstance(hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], maxWaitingDays);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', waitingList.stringifyClass());
    if (bufferedResult.length > 0) {
        console.log(waitingList.getHospitalCode() + ' ' + waitingList.getServiceCode());
    } else {
        console.log(`Error while creating new WaitingList with id ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
    }
    gateway.disconnect();
};

module.exports = createWaitingList;
