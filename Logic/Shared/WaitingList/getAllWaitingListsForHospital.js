const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const WaitingList = require('../../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList.js');

async function getWaitingListsForHospital() {
    const identityName = process.argv[2];
    const hospitalCode = process.argv[3];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DIRECTOR, identityName.DOCTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let modeledWLists = [];
    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getAllWaitingListsForHospital', hospitalCode);
    if (bufferedResult.length > 0) {
        const jsonResult = JSON.parse(bufferedResult.toString());
        
        let index = 0;
        while(index != null) {
            const wlistElement = jsonResult[index];
            if (wlistElement == undefined) {
                index = null;
            } else {
                const modeledWList = new (WaitingList)(wlistElement);
                modeledWLists.push(modeledWList);
                index++;
           }    
        };
        console.log(modeledWLists);
    } else {
        console.log(`Error while retriving all waitingLists for hospital with HospitalCode ${hospitalCode}`);
    }
    gateway.disconnect();
    return modeledWLists;
};

getWaitingListsForHospital().then(() => {
}).catch((exception) => {
    console.log('Retriving Waiting Lists for hospital failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});