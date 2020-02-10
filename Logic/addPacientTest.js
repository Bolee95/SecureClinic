const fabricNetwork = require('fabric-network');
const path = require('path');
const os = require('os');
const SmartContractUtil = require('../Contracts/Pacient/functionalTests/js-smart-contract-util');

async function addPacientTest() {
    const homedir = os.homedir();
    const walletPath = path.join(homedir,  '.fabric-vscode', 'wallets', 'local_fabric_wallet');
    const gateway = new fabricNetwork.Gateway();
    const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);
    const identityName = 'admin';
    let connectionProfile;
    try {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
    } catch (error) {
        console.log(error);
        return;
    }
    const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
    const discoveryEnabled = true;

    // Check if user exists in wallets
    const userExists = await fabricWallet.exists(identityName);
    if (!userExists) {
        console.log('User with that identity does not exist!');
        return;
    }

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

    // Getting Network channel
    const network = await gateway.getNetwork('mychannel');
    if(!network) {
        console.log('Couldn\'t connect to passed channel.');
        return;
    }

    // Connecting to Contract
    const contract = network.getContract('Pacient');
    const responseBuff = await contract.evaluateTransaction('pacientExists', '000000003');

    // Disconecting from Gateway
    await gateway.disconnect();

    console.log(JSON.parse(responseBuff.toString()));
}
addPacientTest();