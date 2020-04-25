const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');

async function addNewEvidenceToAmmend() {
    const identityName = process.argv[2];
    const evidenceId = process.argv[3];
    const hospitalCode = process.argv[4];
    const ammendId = process.argv[5];
   
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode,ammendId]);
    if (bufferedResult.length > 0) {
        const ammend = JSON.parse(bufferedResult.toString());
        const modeledAmmend = new (Ammend)(ammend);

        modeledAmmend.addEvicence(evidenceId);

        const updateResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'updateAmmend', modeledAmmend.stringifyClass());
        if (updateResult.length > 0) {
            const result = JSON.parse(updateResult.toString());
            if (result == true) {
                console.log(`New evidence ${evidenceId} successfully added!`);   
            }
        } else {
            console.log(`Error while adding evidence for Ammend with id ${evidenceId}...`);
        }
    }  
    gateway.disconnect();   
};

addNewEvidenceToAmmend().then(() => {
}).catch((exception) => {
    console.log('Signing Ammend failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});
