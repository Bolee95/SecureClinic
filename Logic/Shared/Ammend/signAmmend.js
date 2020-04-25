const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Ammend = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend.js');
const Approver = require('../../../ChaincodeWithStatesAPI/AmmendContract/lib/approver.js');
const RemovePacientFromWList = require('../../Auto/removePacientFromWaitingList.js');

async function signAmmend() {
    const identityName = process.argv[2];
    const workingLicence = process.argv[3];
    const hospitalCode = process.argv[4];
    const ammendId = process.argv[5];
   
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

    const role = getRole(identityName);
    const approver = Approver.createInstance(role,workingLicence);
    let updateRes;

    const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAmmend', [hospitalCode,ammendId]);
    if (bufferedResult.length > 0) {
        const ammend = JSON.parse(bufferedResult.toString());
        const modeledAmmend = new (Ammend)(ammend);

        modeledAmmend.addApprover(approver);

        const updateResult = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'updateAmmend', modeledAmmend.stringifyClass());
        if (updateResult.length > 0) {
            const result = JSON.parse(updateResult.toString());
            updateRes = (Boolean)(result);
            if (updateRes == true) {
                console.log(`New sign ${hospitalCode + '-' + ammendId} successfully added!`);

                if (modeledAmmend.getListOfApprovers().length > modeledAmmend.getNumberOfNeededEndrsments()) {
                    // await RemovePacientFromWList(gateway,hospitalCode,modeledAmmend.)
                } else {
                    gateway.disconnect(); 
                }
            }
        } else {
            console.log(`Error while signing Ammend with id ${hospitalCode + ':' + ammendId}...`);
        }
    }  
    return updateRes;
};

signAmmend().then(() => {
}).catch((exception) => {
    console.log('Signing Ammend failed.... Error:\n');
    console.log(exception);
    process.exit(-1);
}).finally(() => {
});

function getRole(identityName) {
    if (identityName.includes(IdentityRole.DIRECTOR)) {
        return IdentityRole.DIRECTOR;
    } else if (identityName.includes(IdentityRole.DOCTOR)) {
        return IdentityRole.DOCTOR;
    } else if (identityName.includes(IdentityRole.TEHNICAL)) {
        return IdentityRole.TEHNICAL;
    }
}
