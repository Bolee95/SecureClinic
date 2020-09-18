const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getWaitingListsForHospital(identityName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledWLists = [];

    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getAllWaitingListsForHospital', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
            let index = 0;
            while(index != null) {
                const wlistElement = jsonResult[index];
                if (wlistElement == undefined) {
                    index = null;
                } else {
                    const modeledWList = new (WaitingList)(wlistElement);
                    modeledWLists.push(modeledWList);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all waitingLists for hospital with HospitalCode ${hospitalCode}`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledWLists;
};

module.exports = getWaitingListsForHospital;
// getWaitingListsForHospital().then(() => {
// }).catch((exception) => {
//     console.log('Retriving Waiting Lists for hospital failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });