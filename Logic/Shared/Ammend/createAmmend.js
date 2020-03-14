const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const AmmendType = require('../../utils/js-smart-contract-ammend-type.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');


//let ammend1 = Ammend.createInstance('aba123', 'AB', '12345123', 'Delete', '2', '', [], [approver1, approver2]);
async function createAmmend() {
    const identityName = process.argv[2];
    const ammendId = process.argv[3];
    const hospitalCode = process.argv[4];
    const pacientJmbg = process.argv[5];
    const action = process.argv[6];
    const neededEndors = process.argv[7];
    const listId = process.argv[8];

    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DOCTOR, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const ammend = Ammend.createInstance(ammendId, hospitalCode,pacientJmbg, action, neededEndors, listId, [], []);

    checkAndSetAmmendType(ammend, identityName);

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'addAmmend', ammend.stringifyClass());
    if (bufferedResult.length > 0) {
        console.log(ammend.getAmmendId());
    } else {
        console.log(`Error while creating Ammend...`);
    }  
    gateway.disconnect();   
};

createAmmend().then(() => {
}).catch((exception) => {
    console.log('Creating new ammend failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});

function checkAndSetAmmendType(ammend, identityName) 
{
    if (identityName.includes(IdentityRole.DOCTOR))
    {
        ammend.setAmmendTypeMedical();
    } 
    else if (identityName.includes(IdentityRole.TEHNICAL))
    {
        ammend.setAmmendTypeTehnical();
    }
}