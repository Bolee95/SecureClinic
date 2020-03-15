const IdentityRole = require ('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util');
const Pending = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/pending.js');
const Approver = require('../../../ChaincodeWithStatesAPI/PendingContract/lib/approver.js');
const AddPacientToWaitingList = require('../../Auto/addPacientToWaitingList.js');

async function approvePending() {
    const identityName = process.argv[2];
    const licenceId = process.argv[3];
    const hospitalCode = process.argv[4];
    const serviceCode = process.argv[5];
    const ordinationCode = process.argv[6];
    const pacientLbo = process.argv[7];
    // Using Utility class to setup everything
    const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    // Check if user exists in wallets
    await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
    await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.TEHNICAL, IdentityRole.DIRECTOR]);
    // Connecting to Gateway
    const gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
    let updatingResult;
    //[hospitalCode,serviceCode,ordinationCode,pacientLbo]
    let bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getPending', [hospitalCode,serviceCode,ordinationCode,pacientLbo]);
    if (bufferedResult.length > 0) {
        let jsonResult = JSON.parse(bufferedResult.toString());
        modeledPending = new (Pending)(jsonResult);
        const role = getRole(identityName);
 
        for (const approver of modeledPending.approvers) {
            const modeledApprover = new (Approver)(approver);
            if (modeledApprover.getApproverRole() == role) {
                throw new Error(`Approver with role ${role} and licence Id  ${licenceId} already approved this pending!`);
            } 
        }
        
        const approver = Approver.createInstance(licenceId, role);
        modeledPending.addApprover(approver);
        console.log(modeledPending);

        bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'updatePending', modeledPending.stringifyClass());
        if (bufferedResult.length > 0) {
            jsonResult = JSON.parse(bufferedResult.toString());
            updatingResult = (Boolean)(jsonResult);
            console.log(updatingResult);

            if (updatingResult == true && modeledPending.approvers.length >= 3) {
                await AddPacientToWaitingList(gateway,hospitalCode,serviceCode,ordinationCode,pacientLbo);
            } else {
                gateway.disconnect();
            }
        }
    } else {
        console.log(`Error while approving pending with id ${hospitalCode + ' ' + serviceCode + ' ' + ordinationCode + ' ' + pacientLbo}...`);
    }
    return updatingResult;
};

approvePending().then(() => {
}).catch((exception) => {
    console.log('Approving pending failed.... Error:\n');
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
