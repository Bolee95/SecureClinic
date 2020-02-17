const fabricNetwork = require('fabric-network');
const path = require('path');
const os = require('os');
const SmartContractUtil = require('./utils/js-smart-contract-util');

async function readPacient() {
    const homedir = os.homedir();
    const walletPath = path.join(homedir,  '.fabric-vscode', 'environments', 'Local Fabric', 'wallets', 'Org1');
    const gateway = new fabricNetwork.Gateway();
    const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);
    const connectionProfile = await SmartContractUtil.getConnectionProfile();

    const identityName = process.argv[2];
    const pacientId = process.argv[3];

    const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
    const discoveryEnabled = true;

    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);

    // Setting up Gateway parameters
    const options = {
        discovery: {
            asLocalhost: discoveryAsLocalhost,
            enabled: discoveryEnabled,
        },
        identity: identityName,
        wallet: fabricWallet,
    };

    // Connecting to Gateway
    await gateway.connect(connectionProfile, options);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient','readPacient', pacientId);

    let pacient = JSON.parse(bufferedResult.toString());
    console.log(pacient.jmbg);

    gateway.disconnect();
};

readPacient().then(() => {
    console.log('Creating new Pacient started!');
}).catch((expection) => {
    console.log('Exception catched');
    console.log(expection);
    console.log(expection.stack);
    process.exit(-1);
});