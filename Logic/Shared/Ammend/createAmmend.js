const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createAmmend(identityName, hospitalCode, ordinationCode, serviceCode, hospitalName, ordinationName, serviceName, pacientLbo, screename, action, description, evidencesIds) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        var evidences = [];
        if (evidencesIds === "") {
            evidences = [];
        } else {
            evidences = evidencesIds.split(',');
        }

        const newAmmend = Ammend.createInstance(hospitalCode, ordinationCode, serviceCode, hospitalName, ordinationName, serviceName, pacientLbo, screename, action, description, evidences, [], false);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'addAmmend', newAmmend.stringifyClass());
        if (bufferedResult.length > 0) {
            gateway.disconnect();
            return newAmmend;
        } else {
            throw new Error(`Error while creating Ammend with id: ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}!`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createAmmend;

function checkAndSetAmmendType(ammend, identityName) 
{
    if (identityName.includes(IdentityRole.DOCTOR))
    {
        ammend.setAmmendTypeMedical();
    } 
    else if (identityName.includes(IdentityRole.TEHNICAL))
    {
        ammend.setAmmendTypeTehnical();
    }
}