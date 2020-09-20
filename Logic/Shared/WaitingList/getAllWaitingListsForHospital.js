const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getWaitingListsForHospital(identityName, hospitalCode) {
    let modeledWLists = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR, identityName.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
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
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledWLists;
};

module.exports = getWaitingListsForHospital;
