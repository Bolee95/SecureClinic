const fabricNetwork = require('fabric-network');
const path = require('path');
const os = require('os');
const SmartContractUtil = require('./utils/js-smart-contract-util');

async function checkPacientExists() {
    const homedir = os.homedir();
    const walletPath = path.join(homedir,  '.fabric-vscode', 'environments', 'Local Fabric', 'wallets', 'Org1');
    const gateway = new fabricNetwork.Gateway();
    const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);
    let connectionProfile;
    const identityName = process.argv[2];
    connectionProfile = await SmartContractUtil.getConnectionProfile();
    
    const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
    const discoveryEnabled = true;

    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet,identityName);

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

    const ca = gateway.getCurrentIdentity().getRoles();
    console.log(ca);
    // Execute Transaction
    const result = await SmartContractUtil.submitTransaction(gateway,'Pacient','pacientExists','000000003');
    // Disconecting from Gateway
    gateway.disconnect();

    console.log(result.toString());
}
checkPacientExists();