const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getWaitingList(identityName, hospitalCode, ordinationCode, serviceCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledWaitingList;

    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, ordinationCode, serviceCode]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            modeledWaitingList = new (WaitingList)(jsonResult);
        } else {
            throw new Error(`Error while retrieving WaitingList with id ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledWaitingList;
};

module.exports = getWaitingList;