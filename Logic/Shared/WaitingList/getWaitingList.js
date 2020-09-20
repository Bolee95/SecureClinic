const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getWaitingList(identityName, hospitalCode, ordinationCode, serviceCode) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, ordinationCode, serviceCode]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledWaitingList = new (WaitingList)(jsonResult);

            gateway.disconnect();
            return modeledWaitingList;
        } else {
            throw new Error(`Error while retrieving WaitingList with id ${hospitalCode}:${ordinationCode}:${serviceCode}...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = getWaitingList;