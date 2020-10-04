const Hospital = require('./../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital');
const WaitingList = require('./../../ChaincodeWithStatesAPI/WaitingListContract/lib/waitingList');
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
        var timestamp = Date.now();

        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.ADMIN, IdentityRole.DIRECTOR]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
   
        const hospitalResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
        if (hospitalResult.length > 0) {
            const jsonResult = JSON.parse(hospitalResult.toString());
            const modeledHospital = new (Hospital)(jsonResult);
            numberOfServices = modeledHospital.getServices().length;
        } else {
            throw new Error(`Couldn't retrieve hospital with hospital code ${hospitalCode}...`);
        }


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
            }
        }

        let newStat = Stat.createInstance(timestamp,numberOfPacients,numberOfServices);
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