const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function retrieveAllPendings(identityName) {
    let modeletedPendings = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN]);
       
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendings');
        if (bufferedResult.length > 0) {
            let jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const pendingElement = jsonResult[index];
                if (pendingElement == undefined) {
                    index = null;
                } else {
                    const modeledPending = new (Pending)(pendingElement);
                    modeletedPendings.push(modeledPending);
                    index++;
               }    
            };
        } else {
            throw new Error(`Error while reading all pendings...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeletedPendings;
};

module.exports = retrieveAllPendings;