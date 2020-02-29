const SmartContractUtil = require('./utils/js-smart-contract-util.js');

const IdentityRole = require('./utils/js-smart-contract-globals.js');
const Pacient = require('../../Contracts/Chaincodes with statesAPI/PacientContract/lib/pacient.js');

async function readPacient() {

    const identityName = process.argv[2];
    const pacientId = process.argv[3];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.USER);

    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet,identityName);    

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient','getPacient', pacientId);

    if (bufferedResult.length > 0) {
        let pacient = Pacient.deserialize(bufferedResult);
        console.log(pacient.getNameAndSurname());
    } else {
        console.log(`No pacient registered with pacientId ${pacientId}.`);
    }
    gateway.disconnect();
};

readPacient().then(() => {
    console.log('Creating new Pacient started!');
}).catch((expection) => {
    console.log('Exception catched');
    console.log(expection);
    console.log(expection.stack);
    process.exit(-1);
}).finally(() => {
    console.log('ReadPacient function call ended.');
});