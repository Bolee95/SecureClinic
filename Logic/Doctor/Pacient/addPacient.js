const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingState = require('../../utils/js-smart-contact-waiting-status.js');
const Pacient = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacient.js');

async function createPacient(identityName, name, surname, lbo, jmbg, uniqueId, city) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    let pacient = Pacient.createInstance(name, surname, lbo, jmbg, uniqueId, city, WaitingState.NONACTIVE,'','','');
    let result;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacient', pacient.stringifyClass());
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        result = (Boolean)(jsonResult);
        console.log(result);
    } else {
        console.log(`Error while creating new Pacient...`);
    }
    gateway.disconnect();
    return result;
};

module.exports = createPacient;

// createPacient().then(() => {
// }).catch((exception) => {
//     console.log('Creating pacient failed.... Error:\n');
//     console.log(exception);
//     process.exit(-1);
// }).finally(() => {
// });