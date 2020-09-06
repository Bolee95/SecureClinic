const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const AmmendType = require('../../utils/js-smart-contract-ammend-type.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');

async function createAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo, action, description, evidencesIds) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    var evidences;
    if (evidencesIds === "") {
        evidences = [];
    } else {
        evidences = evidencesIds.split(',');
    }

    const newAmmend = Ammend.createInstance(hospitalCode, ordinationCode, serviceCode, pacientLbo, action, description, evidences, [], false);

    //checkAndSetAmmendType(ammend, identityName);
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'addAmmend', newAmmend.stringifyClass());
    gateway.disconnect();   

    if (bufferedResult.length > 0) {
        return true;
    } else {
        throw new Error(`Error while creating Ammend with id -- ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}!`);
    }  ;   
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