const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const Approver = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/approver.js');

async function getPendingsForHospital(identityName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPendings = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendingsForHospitalCode', hospitalCode);

    const role = getRole(identityName);
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
                    if (modeledApprover.getApproverRole() == role) {
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
    gateway.disconnect();
    return modeledPendings;
};

module.exports = getPendingsForHospital;

function getRole(identityName) {
    if (identityName.includes(IdentityRole.DIRECTOR)) {
        return IdentityRole.DIRECTOR;
    } else if (identityName.includes(IdentityRole.DOCTOR)) {
        return IdentityRole.DOCTOR;
    } else if (identityName.includes(IdentityRole.TEHNICAL)) {
        return IdentityRole.TEHNICAL;
    }
}
