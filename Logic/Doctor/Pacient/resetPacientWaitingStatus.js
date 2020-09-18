const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function resetPacientWaitingStatus(identityName, pacientLbo) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updatingResult;
    var returnError = false;
    try {
        let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
        if (bufferedResult.length > 0) {
            let jsonResult = JSON.parse(bufferedResult.toString());
            const pacient = new (Pacient)(jsonResult);

            pacient.setHospitalCode('');
            pacient.setHospitalName('');
            pacient.setOrdinationCode('');
            pacient.setServiceCode('');
            pacient.setWaitingStatusNonactive();

            bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacient', pacient.stringifyClass());
            if (bufferedResult.length > 0) {
                jsonResult = JSON.parse(bufferedResult.toString());
                updatingResult = (Boolean)(jsonResult);
            } else {
                returnError = true;
            }
        } else {
            returnError = true;
        }

        if (returnError) {
            throw new Error(`Error while updating Pacient with id ${pacientLbo} to reseted waiting status...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return updatingResult;
};

module.exports = resetPacientWaitingStatus;