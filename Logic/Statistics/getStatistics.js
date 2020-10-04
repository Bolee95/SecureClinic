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

            gateway.disconnect();
            return modeledStatistic;
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