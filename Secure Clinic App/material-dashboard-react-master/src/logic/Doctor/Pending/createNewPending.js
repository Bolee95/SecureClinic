const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function createPending() {
    const identityName = process.argv[2];
    const pacientLbo = process.argv[3];
    const pacientJmbg = process.argv[4];
    const hospitalCode = process.argv[5];
    const serviceCode = process.argv[6];
    const ordinationCode = process.argv[7];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const pending = Pending.createInstance(pacientLbo,pacientJmbg,hospitalCode,serviceCode,ordinationCode,[]);
    let addingResult;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'addPending', pending.stringifyClass());
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        addingResult = (Boolean)(jsonResult);
        console.log(addingResult);
    } else {
        console.log(`Error while creating new Pending...`);
    }
    gateway.disconnect();
    return addingResult;
};

createPending().then(() => {
}).catch((exception) => {
    console.log('Creating Pending failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});