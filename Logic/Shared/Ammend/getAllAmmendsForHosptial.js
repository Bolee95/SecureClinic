const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const Approver = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/approver.js');

async function getAllAmmendsForHospital(identityName, hospitalCode) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmends = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmendsForHospital', hospitalCode);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        
        // TO-DO: Should be reconsidered and fixed, replaced with something else
        const role = getRole(identityName);
        let index = 0;
        while(index != null) {
            const ammendElement = jsonResult[index];
            if (ammendElement == undefined) {
                index = null;
            } else {
                const modeledAmmend = new (Ammend)(ammendElement);
                var alreadyApproved = false;

                if (modeledAmmend.approvers == undefined) {
                    modeledAmmend.approvers = [];
                }

                for (const approver of modeledAmmend.approvers) {
                    const modeledApprover = new (Approver)(approver);
                    if (modeledApprover.getRole() == role) {
                        alreadyApproved = true;
                    } 
                }
                if (!alreadyApproved) {
                    modeledAmmends.push(modeledAmmend);
                }
                index++;
           }    
        };
    } else {
        throw new Error(`Error while retriving all ammends for hospital with HospitalCode ${hospitalCode}`);
    }
    gateway.disconnect();
    return modeledAmmends;
};

module.exports = getAllAmmendsForHospital;

// TO-DO: Should be replaced and fixed, not good implementation
function getRole(identityName) {
    if (identityName.includes(IdentityRole.DIRECTOR)) {
        return IdentityRole.DIRECTOR;
    } else if (identityName.includes(IdentityRole.DOCTOR)) {
        return IdentityRole.DOCTOR;
    } else if (identityName.includes(IdentityRole.TEHNICAL)) {
        return IdentityRole.TEHNICAL;
    }
}
