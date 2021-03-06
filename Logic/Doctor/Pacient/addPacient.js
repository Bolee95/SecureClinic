const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingState = require('../../utils/js-smart-contact-waiting-status.js');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function createPacient(identityName, name, surname, lbo, jmbg, city, hospitalCode, hospitalName) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
       
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        let pacient = Pacient.createInstance(name, surname, lbo, jmbg, city, WaitingState.NONACTIVE, hospitalName, hospitalCode, '', '');
    
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacient', pacient.stringifyClass());
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            let result = (Boolean)(jsonResult);
            if (result) {
                let pacientPrivateData = PacientPrivateData.createInstance(lbo, jmbg, name + ' ' + surname, [], []);
                const bufferedRes = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacientPrivateData', pacientPrivateData.stringifyClass());
                if (bufferedRes.length > 0) {
                    gateway.disconnect();
                    return pacient;
                } else {
                    throw new Error(`Error while creating new Private Data for Pacient with lbo ${lbo}...`);
                }
            }
        } else {
            throw new Error(`Error while creating new Pacient with lbo ${lbo}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = createPacient;