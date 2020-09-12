const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const Approver = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/approver.js');
const Entity = require('../../../ChaincodeWithStatesAPI/EntityContract/lib/entity.js');
const RemovePacientFromWList = require('../../Auto/removePacientFromWaitingList.js');

async function approveAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo, licenceId) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const role = await getRole(gateway, licenceId);

    if (role === undefined) {
        throw new Error(`Entity with licenceId ${licenceId} does not exist!`);
    }

    const approver = Approver.createInstance(role, licenceId);
    let updateRes;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode, ordinationCode, serviceCode, pacientLbo]);
    if (bufferedResult.length > 0) {
        const ammend = JSON.parse(bufferedResult.toString());
        const modeledAmmend = new (Ammend)(ammend);

        for (const approver of modeledAmmend.approvers) {
            const modeledApprover = new (Approver)(approver);
            if (modeledApprover.licenceId == licenceId) {
                throw new Error(`Approver with role ${role} and licence Id  ${licenceId} already approved this pending!`);
            } 
        }

        modeledAmmend.addApprover(approver);

        if (modeledAmmend.approvers.length >= 3) {
            modeledAmmend.isReviewed = true;
        }

        const updateResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'updateAmmend', modeledAmmend.stringifyClass());
        if (updateResult.length > 0) {
            const result = JSON.parse(updateResult.toString());
            updateRes = (Boolean)(result);
            if (updateRes == true) {
                if (modeledAmmend.getListOfApprovers().length >= 3) {
                     await RemovePacientFromWList(gateway, hospitalCode, ordinationCode, serviceCode, pacientLbo);
                } else {
                    gateway.disconnect(); 
                }
            }
        } else {
            throw new Error(`Error while signing Ammend with id ${hospitalCode}:${ordinationCode}:${serviceCode}:${pacientLbo}!`);
        }
    }  
    return updateRes;
};

module.exports = approveAmmend;

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