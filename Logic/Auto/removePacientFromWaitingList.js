const SmartContractUtil = require('../utils/js-smart-contract-util');
const AcceptedPacient = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const WaitingList = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const { ResponseError, getErrorFromResponse } = require('../../Logic/Response/Error.js');

async function removePacientFromWaitingList(gateway, hospitalCode, ordinationCode, serviceCode, pacientLbo) {
    let waitingList;
    let updateRes;

    try {
        const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode ,ordinationCode, serviceCode]);
        if (waitingListResult.length > 0) {
            const jsonResult = JSON.parse(waitingListResult.toString());
            waitingList = new (WaitingList)(jsonResult);

            for (const pacient of waitingList.getAllPacients()) {
                let modeledPacient = new (AcceptedPacient)(pacient);
                if (modeledPacient.pacientLbo === pacientLbo) {
                    const index = waitingList.pacients.indexOf(pacient);
                    if (index > -1) {
                        waitingList.pacients.splice(index,1);
                    }
                }
            }

            const updateResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'updateWaitingList', waitingList.stringifyClass());
            if (updateResult.length > 0) {
                const jsonResult = JSON.parse(updateResult.toString());
                updateRes = (Boolean)(jsonResult);
                if (updateRes == true) {
                } else {
                    throw new Error(`Removing pacient with id ${pacientLbo} from waiting list with id ${hospitalCode}:${ordinationCode}:${serviceCode} unsuccessful!`);
                }
            }
            return updateRes; 
        }
        else {
            throw new Error(`There is no waiting list with id ${hospitalCode}:${ordinationCode}:${serviceCode}!`);
        }
    } catch (error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};
module.exports = removePacientFromWaitingList;