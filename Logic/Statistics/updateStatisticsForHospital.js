const Hospital = require('./../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital');
const WaitingList = require('./../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList');
const Ammend = require('./../../ChaincodeWithStatesAPI/AmmendContract/lib/ammend');
const AmmendApprover = require('./../../ChaincodeWithStatesAPI/AmmendContract/lib/approver');
const Pending = require('./../../ChaincodeWithStatesAPI/PendingContract/lib/pending');
const PendingApprover = require('./../../ChaincodeWithStatesAPI/PendingContract/lib/approver');
const Stat = require('./../../ChaincodeWithStatesAPI/StatisticContract/lib/stats');
const Statistic = require('./../../ChaincodeWithStatesAPI/StatisticContract/lib/statistic');
const SmartContractUtil = require('./../utils/js-smart-contract-util');
const IdentityRole = require('./../utils/js-smart-contract-globals');
const { ResponseError, getErrorFromResponse } = require('../Response/Error');

async function updateStatisticsForHospital(identityName, hospitalCode) {
    var gateway;
    try 
    {
        var numberOfServices = 0;
        var numberOfPacients = 0;
        var numberOfAmmends = 0;
        var numberOfUnapprovedAmmends = 0;
        var numberOfApprovedAmmends = 0;
        var numberOfPendings = 0;
        var numberOfUnaprovedPendings = 0;
        var numberOfApprovedPendings = 0;
        var waitingListsStats = [];
        var timestamp = Date.now();

        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
   
        // Number of services
        const hospitalResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
        if (hospitalResult.length > 0) {
            const jsonResult = JSON.parse(hospitalResult.toString());
            const modeledHospital = new (Hospital)(jsonResult);
            numberOfServices = modeledHospital.getServices().length;
        } else {
            throw new Error(`Couldn't retrieve hospital with hospital code ${hospitalCode}...`);
        }

        // Number of pacients in hospital
        var modeledWLists = [];
        const waitingListsResults = await SmartContractUtil.submitTransaction(gateway, 'WaitingList', 'getAllWaitingListsForHospital', hospitalCode);
        if (waitingListsResults.length > 0) {
            const jsonResult = JSON.parse(waitingListsResults.toString());
            
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

            for(let index = 0; index < modeledWLists.length; index++) {
                let modeledWlist = modeledWLists[index];
                numberOfPacients = numberOfPacients + modeledWlist.getAllPacients().length;

                let modeledWListStat = {
                    'name': modeledWlist.getServiceName(),
                    'count': modeledWlist.getAllPacients().length
                }

                waitingListsStats.push(modeledWListStat);
            }
        }

        // Number of total ammends and unaproved ones
        var modeledAmmends = [];
        const ammendsResults = await SmartContractUtil.submitTransaction(gateway, 'Ammend', 'getAllAmmendsForHospital', hospitalCode);
        if (ammendsResults.length > 0) {
            const jsonResult = JSON.parse(ammendsResults.toString());
            
            let index = 0;
            while(index != null) {
                const ammendElement = jsonResult[index];
                if (ammendElement == undefined) {
                    index = null;
                } else {
                    const modeledAmmend = new (Ammend)(ammendElement);
                    var alreadyApproved = false;

                    if (modeledAmmend.approvers == undefined) {
                        modeledAmmend.approvers = [];
                    }

                    for (const approver of modeledAmmend.approvers) {
                        const modeledApprover = new (AmmendApprover)(approver);
                        if (modeledApprover.licenceId == identityName) {
                            alreadyApproved = true;
                        }
                    }
                    if (!alreadyApproved) {
                        numberOfUnapprovedAmmends = numberOfUnapprovedAmmends + 1;
                        modeledAmmends.push(modeledAmmend);
                    } else {
                        numberOfApprovedAmmends = numberOfApprovedAmmends + 1;
                    }
                    index++;
                }    
            };
        } 

        numberOfAmmends = modeledAmmends.length;

        var modeledPendings = [];
        // Number of pendings and unaproved ones
        const pendingsResults = await SmartContractUtil.submitTransaction(gateway, 'Pending', 'getAllPendingsForHospitalCode', hospitalCode);
        if (pendingsResults.length > 0) {
            const jsonResult = JSON.parse(pendingsResults.toString());
            
            let index = 0;
            while(index != null) {
                const pendingElement = jsonResult[index];
                if (pendingElement == undefined) {
                    index = null;
                } else {

                    const modeledPending = new (Pending)(pendingElement);
                    var alreadyApproved = false;

                    for (const approver of modeledPending.approvers) {
                        const modeledApprover = new (PendingApprover)(approver);
                        if (modeledApprover.licenceId == identityName) {
                            alreadyApproved = true;
                        } 
                    }
                    if (!alreadyApproved) {
                        numberOfUnaprovedPendings = numberOfUnaprovedPendings + 1;
                        modeledPendings.push(modeledPending);
                    } else {
                        numberOfApprovedPendings = numberOfApprovedPendings + 1;
                    }
                    index++;
                }    
            };
        }

        numberOfPendings = modeledPendings.length;

        /// Stat setup
        let newStat = Stat.createInstance(timestamp, numberOfPacients, numberOfServices, numberOfAmmends, numberOfUnapprovedAmmends, numberOfApprovedAmmends, numberOfPendings, numberOfUnaprovedPendings, numberOfApprovedPendings, waitingListsStats);
        var modeledStatistic;
        var createNewStatistic = false;

        const statisticResult = await SmartContractUtil.submitTransaction(gateway, 'Statistic', 'getStatistic', hospitalCode);
        if (statisticResult.length > 0) {
            const jsonResult =  JSON.parse(statisticResult.toString());
            modeledStatistic = new (Statistic)(jsonResult);

            modeledStatistic.addNewStat(newStat);

            let updatedStatistic = await SmartContractUtil.submitTransaction(gateway, 'Statistic', 'updateStatistic', modeledStatistic.stringifyClass());
            if (updatedStatistic.length > 0) {
            } else {
                throw new Error(`Couldn't update Statistic with hospitalCode ${hospitalCode}`);
            }
        } else {
            createNewStatistic = true;
        }

        if (createNewStatistic) {
            let newStatistic = Statistic.createInstance(hospitalCode, [newStat]);
            const newStatisticResult = await SmartContractUtil.submitTransaction(gateway, 'Statistic', 'addStatistic', newStatistic.stringifyClass());
            if (newStatisticResult.length > 0) {
            } else {
                throw new Error(`Couldn't create Statistic with hospitalCode ${hospitalCode}`)
            }
        }

        gateway.disconnect();
        return true;

    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = updateStatisticsForHospital;