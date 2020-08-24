const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const PacientPrivateData = require('../../../ChaincodeWithStatesAPI/PacientContract/lib/pacientPrivateData.js');

async function getAllPacientsPrivateData(identityName) {
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPacientsPrivateData = [];

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pacient', 'getAllPacientsPrivateData');
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());

        let index = 0;
        while(index != null) {
            const privateDataElement = jsonResult[index];
            if (privateDataElement == undefined) {
                index = null;
            } else {
                const modeledPrivateData = new (PacientPrivateData)(privateDataElement);
                modeledPacientsPrivateData.push(modeledPrivateData);
                index++;
           }    
        };
        console.log(modeledPacientsPrivateData);
    } else {
        console.log(`Error while retriving all pacients private data...`);
    }
    gateway.disconnect();
    return modeledPacientsPrivateData;
};

module.exports = getAllPacientsPrivateData;