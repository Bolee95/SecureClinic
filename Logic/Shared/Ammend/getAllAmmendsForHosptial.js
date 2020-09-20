const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const Approver = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/approver.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllAmmendsForHospital(identityName, hospitalCode, licenceId) {
    let modeledAmmends = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);

        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmendsForHospital', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            
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
                        if (modeledApprover.licenceId == licenceId) {
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
    } catch(error) {
        gateway.disconnect();s
        return ResponseError.createError(400,getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledAmmends;
};

module.exports = getAllAmmendsForHospital;