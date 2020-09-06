const SmartContractUtil = require('../utils/js-smart-contract-util');
const Pacient = require('../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const WaitingList = require('../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function removePacientFromWaitingList(gateway, hospitalCode, serviceCode, ordinationCode, pacientLbo) {
    let waitingList;
    let updateRes;

    const waitingListResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode ,ordinationCode, serviceCode]);
    if (waitingListResult.length > 0) {
        const jsonResult = JSON.parse(waitingListResult.toString());
        waitingList = new (WaitingList)(jsonResult);

        for (const pacient of waitingList.getAllPacients()) {
            let modeledPacient = new (Pacient)(pacient);
            if (modeledPacient.lbo === pacientLbo) {
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

            if (updateResult == true) {
                return true;
            } else {
                throw new Error(`Removing pacient with id ${pacientLbo} from waiting list with id ${hospitalCode}:${ordinationCode}:${serviceCode} unsuccessful!`);
            }
        }

        return updateRes; 
    }
    else {
        throw new Error(`There is no waiting list with id ${hospitalCode}:${ordinationCode}:${serviceCode}!`);
    }
};
module.exports = removePacientFromWaitingList;