const SmartContractUtil = require('../utils/js-smart-contract-util');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const { ResponseError, getErrorFromResponse } = require('../../Logic/Response/Error.js');

async function changePacientStatusToWaiting(gateway, pacientLbo, hospitalName, hospitalCode, ordinationCode, serviceCode) {
    
    let updatingResult;

    try {
        let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
        if (bufferedResult.length > 0) {
            let jsonResult = JSON.parse(bufferedResult.toString());
            const pacient = new (Pacient)(jsonResult);

            pacient.setHospitalName(hospitalName);
            pacient.setHospitalCode(hospitalCode);
            pacient.setOrdinationCode(ordinationCode);
            pacient.setServiceCode(serviceCode);
            pacient.setWaitingStatusActive();

            bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacient', pacient.stringifyClass());
            if (bufferedResult.length > 0) {
                jsonResult = JSON.parse(bufferedResult.toString());
                updatingResult = (Boolean)(jsonResult);
            } else {
                throw new Error(`Error while updating Pacient waiting status to Active...`);
            }
        } else {
            throw new Error(`Error while updating Pacient waiting status to Active...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
}
    gateway.disconnect();
    return updatingResult;
};

module.exports = changePacientStatusToWaiting;
