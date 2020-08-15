const SmartContractUtil = require('../utils/js-smart-contract-util');

async function login(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    const identityExists = await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    return identityExists;
};

module.exports = login;