const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createWaitingList(identityName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, maxWaitingDays) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const waitingList = WaitingList.createInstance(hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], maxWaitingDays);
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'addWaitingList', waitingList.stringifyClass());
        if (bufferedResult.length > 0) {
            gateway.disconnect();
            return waitingList;
        } else {
            throw new Error(`Error while creating new WaitingList with id ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createWaitingList;
