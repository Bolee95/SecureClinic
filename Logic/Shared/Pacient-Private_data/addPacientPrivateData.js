const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');

async function addPacientPrivateData() {
    const identityName = process.argv[2];
    const uniqueId = process.argv[3];
    const cardId = process.argv[4];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    const privateData = PacientPrivateData.createInstance(uniqueId,cardId,[],[]);
    let addingResult;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'addPacientPrivateData', privateData.stringifyClass());
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        addingResult = new (PacientPrivateData)(jsonResult);
        console.log(addingResult);
    } else {
        console.log(`Error while Adding Pacient private data. `);
    }
    gateway.disconnect();
    return addingResult;
};

addPacientPrivateData().then(() => {
}).catch((exception) => {
    console.log('Adding Pacient private data failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});