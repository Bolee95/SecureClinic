const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function changePacientStatusToWaiting(gateway, pacientLbo, hospitalName, waitingListCode, hospitalCode) {
    
    let updatingResult;

    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getPacient', pacientLbo);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        const pacient = new (Pacient)(jsonResult);

        pacient.setHospitalCode(hospitalCode);
        pacient.setHospitalName(hospitalName);
        pacient.setWaitingListCode(waitingListCode);
        pacient.setWaitingStatusActive();

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'updatePacient', pacient.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updatingResult = (Boolean)(jsonResult);
            console.log(updatingResult);
        } else {
            console.log(`Error while updating Pacient waiting status to Active...`);
        }
    } else {
        console.log(`Error while updating Pacient waiting status to Active...`);
    }
    gateway.disconnect();
    return updatingResult;
};

module.exports = changePacientStatusToWaiting;

// addPacientToWaitingList().then(() => {
// }).catch((exception) => {
//     console.log('Updating pacient failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });