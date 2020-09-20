const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId) {  
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode,ammendId]);
        if (bufferedResult.length > 0) {
            const ammend = JSON.parse(bufferedResult.toString());
            const modeledAmmend = new (Ammend)(ammend);
            modeledAmmend.addEvicence(evidenceId);

            const updateResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'updateAmmend', modeledAmmend.stringifyClass());
            if (updateResult.length > 0) {
                const result = JSON.parse(updateResult.toString());
                if (result == true) {
                    gateway.disconnect();
                    return modeledAmmend; 
                }
            } else {
                throw new Error(`Error while adding evidence for Ammend with id ${evidenceId}...`);
            }
        } 
    } catch(error) {
        gateway.disconnect(); 
        return ResponseError.createError(400,getErrorFromResponse(error));
    }   
};

module.exports = addNewEvidenceToAmmend;
