const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addPacientPrivateData(identityName, pacientLbo, cardId, screename) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    const privateData = PacientPrivateData.createInstance(pacientLbo, cardId, screename, [], []);
    var addingResult;
    try {
        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacientPrivateData', privateData.stringifyClass());
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            addingResult = jsonResult;
        } else {
            throw new Error(`Error while Adding Pacient private data with lbo ${pacientLbo}...`);
        }
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
    gateway.disconnect();
    return addingResult;
};

module.exports = addPacientPrivateData;