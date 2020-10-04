const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllPendings(identityName) {
    var gateway;
    let modeledPendings = [];
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendings');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
            let index = 0;
            while(index != null) {
                const pendingElement = jsonResult[index];
                if (pendingElement == undefined) {
                    index = null;
                } else {
                    const modeledPending = new (Pending)(pendingElement);
                    modeledPendings.push(modeledPending);
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all pendings for hospital with HospitalCode ${hospitalCode}`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledPendings;
};

module.exports = getAllPendings;