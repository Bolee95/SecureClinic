const IdentityRole = require('../../utils/js-smart-contract-globals.js');
const SmartContractUtil = require('../../utils/js-smart-contract-util.js');
const Hospital = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospital.js');
const Ordination = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospitalOrdination');
const Service = require('../../../ChaincodeWithStatesAPI/HospitalContract/lib/hospitalService');
const { ResponseError, getErrorFromResponse } = require('../../../Logic/Response/Error.js');

async function addNewOrdinationAndServiceToHospital(identityName, hospitalCode, ordinationName, ordinationCode, serviceName, serviceCode) {
   var gateway;
   try {
         const fabricWallet = await SmartContractUtil.getFileSystemWallet();
         
         await SmartContractUtil.checkIdentityInWallet(fabricWallet, identityName);
         await SmartContractUtil.checkIdentityNameWithRole(identityName, IdentityRole.ADMIN);
         
         gateway = await SmartContractUtil.getConfiguredGateway(fabricWallet, identityName);
         
         const hospital = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'getHospital', hospitalCode);
         if(hospital.length > 0) {
            const modeledHospital = Hospital.deserialize(hospital, Hospital);

            const ordinations = modeledHospital.getListOfOrdinations();
            var shouldAddOrdination = true;
            for (let ordination of ordinations) {
                let modeledOrdination = new (Ordination)(ordination);

                if (modeledOrdination.ordinationCode == ordinationCode) {
                    shouldAddOrdination = false;
                }
            }

            if (shouldAddOrdination) {
                let newOrdination = Ordination.createInstance(ordinationName, ordinationCode);
                modeledHospital.addNewOrdination(newOrdination);
            }

            const services = modeledHospital.getServices();
            for (let service of services) {
                let modeledService = new (Service)(service);

                if(modeledService.serviceCode == serviceCode) {
                    throw new Error(`Service with name ${serviceName} already added to hospital`);
                }
            }

            let newService = Service.createInstance(serviceName, serviceCode);
            modeledHospital.addNewService(newService);

            let updateResult = await SmartContractUtil.submitTransaction(gateway, 'Hospital', 'updateHospital', modeledHospital.stringifyClass());
            if (updateResult.length > 0) {
               gateway.disconnect();
               return modeledHospital;
            }
         } else {
             throw new Error("Hospital not found...");
         }
      } catch(error) {
        if (gateway !== undefined) {
            gateway.disconnect();
        }
         return ResponseError.createError(400, getErrorFromResponse(error));
      }
};

module.exports = addNewOrdinationAndServiceToHospital;