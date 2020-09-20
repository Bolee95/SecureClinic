const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');


async function getAllPacientsForHospital(identityName, hospitalCode) {
    let modeledPacients = [];
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getAllPacients');
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());

            let index = 0;
            while(index != null) {
                const pacientElement = jsonResult[index];
                if (pacientElement == undefined) {
                    index = null;
                } else {
                    const modeledPacient = new (Pacient)(pacientElement);
                    if (modeledPacient.hospitalCode == hospitalCode) {
                        modeledPacients.push(modeledPacient);
                    }
                    index++;
                }    
            };
        } else {
            throw new Error(`Error while retriving all pacients for specific hospital...`);
        }
    } catch(error) {
        gateway.disconnect();
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return modeledPacients;
};

module.exports = getAllPacientsForHospital;