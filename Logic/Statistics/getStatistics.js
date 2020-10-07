const IdentityRole = require ('./../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('./../utils/js-smart-contract-util');
const Statistic = require('./../../ChaincodeWithStatesAPI/StatisticContract/lib/statistic');
const { ResponseError, getErrorFromResponse } = require('./../../Logic/Response/Error.js');

async function getStatistics(identityName, hospitalCode) {
    var gateway;
    try {
        const fabricWallet = await SmartContractUtil.getFileSystemWallet();
    
        await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
        await SmartContractUtil.checkIdentityNameWithRole(identityName, [IdentityRole.DOCTOR, IdentityRole.USER, IdentityRole.ADMIN, IdentityRole.TEHNICAL]);
        
        gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);

        const bufferedResult = await SmartContractUtil.submitTransaction(gateway, 'Statistic', 'getStatistic', hospitalCode);
        if (bufferedResult.length > 0) {
            const jsonResult = JSON.parse(bufferedResult.toString());
            const modeledStatistic = new (Statistic)(jsonResult);

            var returningStats = {};
            const stats = modeledStatistic.getArrayOfStats();
            if (stats.length > 1) {
                returningStats['stats'] = stats.slice(stats.length - 2, stats.length);
                returningStats['diffNumPacients'] = returningStats['stats'][1]['numPacients'] - returningStats['stats'][0]['numPacients'];
                returningStats['diffNumServices'] = returningStats['stats'][1]['numServices'] - returningStats['stats'][0]['numServices'];
                returningStats['diffNumAmmends'] = returningStats['stats'][1]['numAmmends'] - returningStats['stats'][0]['numAmmends'];
                returningStats['diffNumApprovedAmmends'] = returningStats['stats'][1]['numApprovedAmmends'] - returningStats['stats'][0]['numApprovedAmmends'];
                returningStats['diffNumUnapprovedAmmends'] = returningStats['stats'][1]['numUnapprovedAmmends'] - returningStats['stats'][0]['numUnapprovedAmmends'];
                returningStats['diffNumPendings'] = returningStats['stats'][1]['numPendings'] - returningStats['stats'][0]['numPendings'];
                returningStats['diffNumApprovedPendings'] = returningStats['stats'][1]['numApprovedPendings'] - returningStats['stats'][0]['numApprovedPendings'];
                returningStats['diffNumUnapprovedPendings'] = returningStats['stats'][1]['numUnapprovedPendings'] - returningStats['stats'][0]['numUnapprovedPendings'];
                returningStats['diffTimestamp'] = returningStats['stats'][1]['timestamp'] - returningStats['stats'][0]['timestamp'];
                returningStats['waitingListsStats'] = returningStats['stats'][1]['waitingListsStats'];
            } else {
                returningStats = stats;
            }

            gateway.disconnect();
            return returningStats;
        } else {
            throw new Error(`Error while retrieving Statistics with hospitalCode ${hospitalCode}...`);
        }
    } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
        return ResponseError.createError(400, getErrorFromResponse(error));
    }
};

module.exports = getStatistics;