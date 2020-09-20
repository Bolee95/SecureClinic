const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');
const AcceptedPacient = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/acceptedPacient.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function getAllPacientsForWaitingList(identityName, hospitalCode, ordinationCode, serviceCode) {
    let modeledAcceptedPacients = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR, identityName.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
   
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getWaitingList', [hospitalCode, ordinationCode, serviceCode]);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            let modeledWaitingList = new (WaitingList)(jsonResult);

            for (const pacient of modeledWaitingList.getAllPacients()) {
                const acceptedPacient = new (AcceptedPacient)(pacient);
                modeledAcceptedPacients.push(acceptedPacient);
            }
        } else {
            throw new Error(`Error while retriving all pacients for waiting list with HospitalCode ${hospitalCode} ServiceCode ${serviceCode} OrdinationCode ${ordinationCode}`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledAcceptedPacients;
};

module.exports = getAllPacientsForWaitingList;
