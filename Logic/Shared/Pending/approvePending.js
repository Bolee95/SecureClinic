const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const Approver = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/approver.js');
const AddPacientToWaitingList = require('../../Auto/addPacientToWaitingList.js');

async function approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updatingResult;
    //[hospitalCode,serviceCode,ordinationCode,pacientLbo]
    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getPending', [hospitalCode,serviceCode,ordinationCode,pacientLbo]);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        modeledPending = new (Pending)(jsonResult);
        const role = getRole(identityName);
 
        for (const approver of modeledPending.approvers) {
            const modeledApprover = new (Approver)(approver);
            if (modeledApprover.getApproverRole() == role) {
                throw new Error(`Approver with role ${role} and licence Id  ${licenceId} already approved this pending!`);
            } 
        }
        
        const approver = Approver.createInstance(licenceId, role);
        modeledPending.addApprover(approver);
        console.log(modeledPending);

        if (modeledPending.approvers.length >= 3) {
            modeledPending.isReviewed = true;
        }

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'updatePending', modeledPending.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updatingResult = (Boolean)(jsonResult);
            console.log(updatingResult);

            if (updatingResult == true && modeledPending.approvers.length >= 3) {
                await AddPacientToWaitingList(gateway, modeledPending.getHospitalName(), modeledPending.getOrdinationName(), modeledPending.getServiceName(), hospitalCode, ordinationCode, serviceCode, pacientLbo, modeledPending.getScore());
            } else {
                gateway.disconnect();
            }
        }
    } else {
        console.log(`Error while approving pending with id ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}...`);
    }
    return updatingResult;
};

module.exports = approvePending;

function getRole(identityName) {
    if (identityName.includes(IdentityRole.DIRECTOR)) {
        return IdentityRole.DIRECTOR;
    } else if (identityName.includes(IdentityRole.DOCTOR)) {
        return IdentityRole.DOCTOR;
    } else if (identityName.includes(IdentityRole.TEHNICAL)) {
        return IdentityRole.TEHNICAL;
    }
}
