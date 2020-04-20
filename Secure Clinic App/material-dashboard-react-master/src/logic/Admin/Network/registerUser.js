const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const fabricNetwork = require('fabric-network');

async function registerUser(_identityName, _username) {
    const identityName = identityName; //process.argv[2];
    const username = username; //process.argv[3];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();
    
    // Register new user of system
    const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username}, adminIdentity);
    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret});
    const userIdentity = await fabricNetwork.X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    await fabricWallet.import(username, userIdentity);
    console.log(`User with id ${username} registered`);
    gateway.disconnect();
};

export default registerUser;

/*
registerUser().then(() => {
    //console.log('RegisterUser function started!');
}).catch((exception) => {
    console.log('Registering new user failed... Error:\n!');
    console.log(exception);
    //console.log(exception.stack);
    process.exit(-1);
}).finally(() => {
    //console.log('RegisterUser fucniton call ended!');
})
*/