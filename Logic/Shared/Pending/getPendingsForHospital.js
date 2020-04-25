const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');

async function getPendingsForHospital() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.TEHNICAL, IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledPendings = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendingsForHospitalCode', hospitalCode);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        
        let index = 0;
        while(index != null) {
            const pendingElement = jsonResult[index];
            if (pendingElement == undefined) {
                index = null;
            } else {
                const modeledPending = new (Pending)(pendingElement);
                modeledPendings.push(modeledPending);
                index++;
           }    
        };
        console.log(modeledPendings);
    } else {
        console.log(`Error while retriving all pendings for hospital with HospitalCode ${hospitalCode}`);
    }
    gateway.disconnect();
    return modeledPendings;
};

getPendingsForHospital().then(() => {
}).catch((exception) => {
    console.log('Retriving pendings for hospital failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});