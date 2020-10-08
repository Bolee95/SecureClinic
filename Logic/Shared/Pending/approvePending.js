const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const Approver = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/approver.js');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity.js');
const AddPacientToWaitingList = require('../../Auto/addPacientToWaitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function approvePending(identityName, licenceId, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
    var updatingResult;
    var finalResult;
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getPending', [hospitalCode,ordinationCode,serviceCode,pacientLbo]);
        if (bufferedResult.length > 0) {
            let jsonResult = JSON.parse(bufferedResult.toString());
            modeledPending = new (Pending)(jsonResult);
            const role = await getRole(gateway, licenceId);
            
            if (role === undefined) {
                throw new Error(`Entity with licenceId ${licenceId} does not exist!`);
            }
    
            for (const approver of modeledPending.approvers) {
                const modeledApprover = new (Approver)(approver);
                if (modeledApprover.licenceId == licenceId) {
                    throw new Error(`Approver with role ${role} and licence Id  ${licenceId} already approved this pending!`);
                } 
            }
            
            const approver = Approver.createInstance(licenceId, role);
            modeledPending.addApprover(approver);

            if (modeledPending.approvers.length >= 3) {
                modeledPending.isReviewed = true;
            }

            bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'updatePending', modeledPending.stringifyClass());
            if (bufferedResult.length > 0) {
                jsonResult = JSON.parse(bufferedResult.toString());
                updatingResult = (Boolean)(jsonResult);

                // For test purposes set to 1, it should be 3
                if (updatingResult == true && modeledPending.approvers.length >= 1) {
                    finalResult = await AddPacientToWaitingList(gateway, modeledPending.getHospitalName(), modeledPending.getOrdinationName(), modeledPending.getServiceName(), hospitalCode, ordinationCode, serviceCode, pacientLbo, modeledPending.getScore());
                } 
            }
        } else {
            throw new Error(`Error while approving pending with id ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400,getErrorFromResponse(error));
    }

    gateway.disconnect();
    if (finalResult === undefined) {
        return updatingResult;
    } else {
        return finalResult;
    }
};

module.exports = approvePending;

async function getRole(gateway, licenceId) {
    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Entity', 'getEntity', licenceId);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        let modeledEntity = new (Entity)(jsonResult);
        return modeledEntity.role;
    } else {
        return undefined;
    }
}
