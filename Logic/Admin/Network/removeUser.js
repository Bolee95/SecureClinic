const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
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

        // Remove user of system
        await ca.revoke({ enrollmentID: username }, adminIdentity);
        await fabricWallet.delete(username);
        console.log(`User with id ${username} removed from wallet.`);
        gateway.disconnect();
        return true;
    } catch (error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = registerUser;