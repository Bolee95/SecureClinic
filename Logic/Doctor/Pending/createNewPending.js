const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function createPending(identityName, pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score, documentIds) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    var documents;
    if (documentIds === "") {
        documents = [];
    } else {
        documents = documentIds.split(',');
    }

    const pending = Pending.createInstance(pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, [], false, score, documents);
    let addingResult;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'addPending', pending.stringifyClass());
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        addingResult = (Boolean)(jsonResult);
        console.log(addingResult);
    } else {
        throw new Error(`Error while creating new Pending...`);
    }
    gateway.disconnect();
    return addingResult;
};

module.exports = createPending;