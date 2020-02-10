const fabricNetwork = require('fabric-network');
const path = require('path');
const os = require('os');
const SmartContractUtil = require('./utils/js-smart-contract-util');

async function registerUser() {
    try {
        const homedir = os.homedir();
        const walletPath = path.join(homedir,  '.fabric-vscode', 'environments', 'Local Fabric', 'wallets', 'Org1');
        const gateway = new fabricNetwork.Gateway();
        const fabricWallet = new fabricNetwork.FileSystemWallet(walletPath);

        const admin = process.argv[2];
        const username = process.argv[3];
        const role = process.argv[4];

        const connectionProfile = await SmartContractUtil.getConnectionProfile();
        
        const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled = true;

        // Check if user exists in wallets
        const userExists = await SmartContractUtil.checkIdentityInWallet(fabricWallet,username);
        if (userExists) {
            console.log('User already enrolled!');
            return;
        }
        // Setting up Gateway parameters
        const options = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: admin,
            wallet: fabricWallet,
        };

        // Connecting to Gateway
        await gateway.connect(connectionProfile, options);

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        //Register new user of system
        ca.revoke
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'TEST' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret});
        const userIdentity = await fabricNetwork.X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await fabricWallet.import(username, userIdentity);
    
        console.log('New user successfully enrolled and imported to wallet!');
        gateway.disconnect();
    }
    catch (error) {
        console.log('Registering new user failed... Error:\n!');
        console.log(error);
        return;
    }
}
registerUser();