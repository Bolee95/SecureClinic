const SmartContractUtil = require('../utils/js-smart-contract-util');
const { ResponseError, getErrorFromResponse } = require('../../Logic/Response/Error');

async function login(identityName) {
    // Using Utility class to setup everything
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
        // Check if user exists in wallets
        const identityExists = await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        return identityExists;
    } catch(error) {
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = login;