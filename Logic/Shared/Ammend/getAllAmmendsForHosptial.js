const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');

async function getAllAmmendsForHospital() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledAmmends = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmendsForHospital', hospitalCode);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        
        let index = 0;
        while(index != null) {
            const ammendElement = jsonResult[index];
            if (ammendElement == undefined) {
                index = null;
            } else {
                const modeledAmmend = new (Ammend)(ammendElement);
                modeledAmmends.push(modeledAmmend);
                index++;
           }    
        };
        console.log(modeledAmmends);
    } else {
        console.log(`Error while retriving all ammends for hospital with HospitalCode ${hospitalCode}`);
    }
    gateway.disconnect();
    return modeledAmmends;
};

getAllAmmendsForHospital().then(() => {
}).catch((exception) => {
    console.log('Retriving ammends for hospital failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});