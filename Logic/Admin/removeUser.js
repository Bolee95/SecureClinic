const IdentityRole = require ('../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../utils/js-smart-contract-util');

async function registerUser() {
    const identityName = process.argv[2];
    const username = process.argv[3];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const ca = gateway.getClient().getCertificateAuthority();
    const adminIdentity = gateway.getCurrentIdentity();

    // Remove user of system
    await ca.revoke({ enrollmentID: username }, adminIdentity);
    await fabricWallet.delete(username);
    console.log(`User with id ${username} removed from wallet.`);
    gateway.disconnect();
};

registerUser().then(() => {
    //console.log('RemoveUser function started!');
}).catch((exception) => {
    console.log('Removing new user failed... Error:\n!');
    console.log(exception);
    //console.log(exception.stack);
    process.exit(-1);
}).finally(() => {
    //console.log('RemoveUser fucniton call ended!');
})