const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const fabricNetwork = require('fabric-network');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function registerUser(identityName, username) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();
        
        // Register new user of system
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username}, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret});
        const userIdentity = await fabricNetwork.X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await fabricWallet.import(username, userIdentity);
        console.log(`User with id ${username} registered`);
        
        gateway.disconnect();
        return true;
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = registerUser;