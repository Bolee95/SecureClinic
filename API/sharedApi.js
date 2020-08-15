const sharedService = require("../Logic/Services/SharedService");

function configureSharedServiceListners(expressApp) {


    // Shared
    expressApp.post("/shared/login", async (req, res, err) => {
        try {
            const formFields = req.fields;
            const userId = formFields["userId"];

            const result = await sharedService.login(userId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Ammend
    expressApp.post("/shared/addNewEvidenceToAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");
            const formFields = req.fields;
            const evidenceId = formFields["evidenceId"];
            const hospitalCode = formFields["hospitalCode"];
            const ammendId = formFields["ammendId"];

            const result = await sharedService.addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/createAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const ammendId = formFields["ammendId"];
            const hospitalCode = formFields["hospitalCode"];
            const pacientJmbg = formFields["pacientJmbg"];
            const action = formFields["action"];
            const neededEndors = formFields["neededEndors"];
            const listId = formFields["listId"];

            const result = await sharedService.createAmmend(identityName, ammendId, hospitalCode, pacientJmbg, action, neededEndors, listId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAllAmmendsForHosptial", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;

            const result = await sharedService.getAllAmmendsForHosptial(identityName, hospitalCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const ammendId = req.query.ammendId;

            const result = await sharedService.getAmmend(identityName, hospitalCode, ammendId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/signAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const workingLicence = formFields["workingLicence"];
            const hospitalCode = formFields["hospitalCode"];
            const ammendId = formFields["ammendId"];

            const result = await sharedService.signAmmend(identityName, workingLicence, hospitalCode, ammendId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Hospital
    expressApp.get("/shared/getHospital/all", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const result = await sharedService.getAllHospitals(identityName);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getHospital", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
    
            const result = await sharedService.getHospital(identityName, hospitalCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Pacient
    expressApp.get("/shared/getPacient", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const pacientLbo = req.query.pacientLbo;
    
            const result = await sharedService.getPacient(identityName, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Pacient Private Data 
    expressApp.post("/shared/privateData/addNewDocumentId", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientId = formFields["pacientId"];
            const documentId = formFields["documentId"];
    
            const result = await sharedService.addNewDocumentId(identityName, pacientId, documentId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/privateData/addNewEntityToSickness", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientId = formFields["pacientId"];
            const deseaseCode = formFields["deseaseCode"];
    
            const result = await sharedService.addNewEntityToSickness(identityName, pacientId, deseaseCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/privateData/addPacientPrivateData", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const uniqueId = formFields["uniqueId"];
            const cardId = formFields["cardId"];
    
            const result = await sharedService.addPacientPrivateData(identityName, uniqueId, cardId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("shared/privateData/getPacientPrivateData", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const pacientId = req.query.pacientId;
    
            const result = await sharedService.getPacientPrivateData(identityName, pacientId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Pending
    expressApp.post("/shared/approvePending", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const licenceId = formFields["licenceId"];
            const hospitalCode = formFields["hospitalCode"];
            const serviceCode = formFields["serviceCode"];
            const ordinationCode = formFields["ordinationCode"];
            const pacientLbo = formFields["pacientLbo"];
    
            const result = await sharedService.approvePending(identityName, licenceId, hospitalCode, serviceCode, ordinationCode, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getPending", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const serviceCode = req.query.serviceCode;
            const ordinationCode = req.query.ordinationCode;
            const pacientLbo = req.query.pacientLbo;

            const result = await sharedService.getPending(identityName, hospitalCode, serviceCode, ordinationCode, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getPendingsForHospital", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
        
            const result = await sharedService.getPendingsForHospital(identityName, hospitalCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Waiting List
    expressApp.post("/shared/createWaitingList", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const hospitalCode = formFields["hospitalCode"];
            const serviceCode = formFields["serviceCode"];
            const ordinationCode = formFields["ordinationCode"];
    
            const result = await sharedService.createWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
   });

    expressApp.get("/shared/getAllPacientsForWaitingList", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const serviceCode = req.query.serviceCode;
            const ordinationCode = req.query.ordinationCode;
        
            const result = await sharedService.getAllPacientsForWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAllWaitingListsForHospital", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
        
            const result = await sharedService.getAllWaitingListsForHospital(identityName, hospitalCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });
    
    expressApp.get("/shared/getWaitingList", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const serviceCode = req.query.serviceCode;
            const ordinationCode = req.query.ordinationCode;
        
            const result = await sharedService.getWaitingList(identityName, hospitalCode, serviceCode, ordinationCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });
}

module.exports = configureSharedServiceListners;