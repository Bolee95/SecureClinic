const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const Approver = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/approver.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getPendingsForHospital(identityName, hospitalCode, licenceId) {
    let modeledPendings = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);

        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendingsForHospitalCode', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
            let index = 0;
            while(index != null) {
                const pendingElement = jsonResult[index];
                if (pendingElement == undefined) {
                    index = null;
                } else {

                    const modeledPending = new (Pending)(pendingElement);
                    var alreadyApproved = false;

                    for (const approver of modeledPending.approvers) {
                        const modeledApprover = new (Approver)(approver);
                        if (modeledApprover.licenceId == licenceId) {
                            alreadyApproved = true;
                        } 
                    }
                    if (!alreadyApproved) {
                        modeledPendings.push(modeledPending);
                    }
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
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledPendings;
};

module.exports = getPendingsForHospital;
