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
    // expressApp.post("/shared/addNewEvidenceToAmmend", async (req, res, err) => {
    //     try {
    //         const identityName = req.get("Identity_name");
    //         const formFields = req.fields;
    //         const evidenceId = formFields["evidenceId"];
    //         const hospitalCode = formFields["hospitalCode"];
    //         const ammendId = formFields["ammendId"];

    //         const result = await sharedService.addNewEvidenceToAmmend(identityName, evidenceId, hospitalCode, ammendId);
    //         res.status(200).json(result);
    //     } catch(error) {
    //         res.status(400).json(error);
    //     }
    // });

    expressApp.post("/shared/createAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const hospitalCode = formFields["hospitalCode"];
            const ordinationCode = formFields["ordinationCode"];
            const serviceCode = formFields["serviceCode"];
            const hospitalName = formFields["hospitalName"];
            const ordinationName = formFields["ordinationName"];
            const serviceName = formFields["serviceName"];
            const pacientLbo = formFields["pacientLbo"];
            const screenname = formFields["screenname"];
            const action = formFields["action"];
            const description = formFields["description"];
            const evidencesIds = formFields["evidencesIds"];

            const result = await sharedService.createAmmend(identityName, hospitalCode, ordinationCode, serviceCode, hospitalName, ordinationName, serviceName, pacientLbo, screenname, action, description, evidencesIds);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAllAmmendsForHosptial", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const licenceId = req.query.licenceId;

            const result = await sharedService.getAllAmmendsForHosptial(identityName, hospitalCode, licenceId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAmmend/all", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const result = await sharedService.getAllAmmends(identityName);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const ordinationCode = req.query.ordinationCode;
            const serviceCode = req.query.serviceCode;
            const pacientLbo = req.query.pacientLbo;

            const result = await sharedService.getAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/approveAmmend", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const hospitalCode = formFields["hospitalCode"];
            const ordinationCode = formFields["ordinationCode"];
            const serviceCode = formFields["serviceCode"];
            const pacientLbo = formFields["pacientLbo"];
            const licenceId = formFields["licenceId"];

            const result = await sharedService.approveAmmend(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo, licenceId);
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
            const pacientLbo = formFields["pacientLbo"];
            const documentId = formFields["documentId"];
    
            const result = await sharedService.addNewDocumentId(identityName, pacientLbo, documentId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/privateData/addNewDiseaseToSicknessHistory", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientLbo = formFields["pacientLbo"];
            const diseaseCode = formFields["diseaseCode"];
            const diseaseName = formFields["diseaseName"];
            const isActive = formFields["isActive"];
    
            const result = await sharedService.addNewDiseaseToSicknessHistory(identityName, pacientLbo, diseaseCode, diseaseName, isActive);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/shared/privateData/addPacientPrivateData", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientLbo = formFields["pacientLbo"];
            const cardId = formFields["cardId"];
            const screenname = formFields["screenname"];
    
            const result = await sharedService.addPacientPrivateData(identityName, pacientLbo, cardId, screenname);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/privateData/getPacientPrivateData", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const pacientLbo = req.query.pacientLbo;
    
            const result = await sharedService.getPacientPrivateData(identityName, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/privateData/getPacientPrivateData/all", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const result = await sharedService.getAllPacientsPrivateData(identityName);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    })

    // Pending
    expressApp.post("/shared/approvePending", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const licenceId = formFields["licenceId"];
            const hospitalCode = formFields["hospitalCode"];
            const ordinationCode = formFields["ordinationCode"];
            const serviceCode = formFields["serviceCode"];
            const pacientLbo = formFields["pacientLbo"];
    
            const result = await sharedService.approvePending(identityName, licenceId, hospitalCode, ordinationCode, serviceCode, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getPending", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const ordinationCode = req.query.ordinationCode;
            const serviceCode = req.query.serviceCode;
            const pacientLbo = req.query.pacientLbo;

            const result = await sharedService.getPending(identityName, hospitalCode, ordinationCode, serviceCode, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getAllPendings", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");
            const result = await sharedService.getAllPendings(identityName);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    })

    expressApp.get("/shared/getPendingsForHospital", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const hospitalCode = req.query.hospitalCode;
            const licenceId = req.query.licenceId;
        
            const result = await sharedService.getPendingsForHospital(identityName, hospitalCode, licenceId);
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
            const hospitalName = formFields["hospitalName"];
            const ordinationName = formFields["ordinationName"];
            const serviceName = formFields["serviceName"];
            const hospitalCode = formFields["hospitalCode"];
            const ordinationCode = formFields["ordinationCode"];
            const serviceCode = formFields["serviceCode"];
            const maxWaitingDays = formFields["maxWaitingDays"];
    
            const result = await sharedService.createWaitingList(identityName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, maxWaitingDays);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
   });

   expressApp.post("/shared/addPacientToWaitingListTest", async (req, res, err) => {
       try {
            const formFields = req.fields;
            const pacientLbo = formFields["pacientLbo"];
            const name = formFields["name"];
            const surname = formFields["surname"];

            const result = await sharedService.addPacientToWaitingListTest(pacientLbo, name, surname);
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
        
            const result = await sharedService.getAllPacientsForWaitingList(identityName, hospitalCode, ordinationCode, serviceCode );
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
            const ordinationCode = req.query.ordinationCode;
            const serviceCode = req.query.serviceCode;
        
            const result = await sharedService.getWaitingList(identityName, hospitalCode, ordinationCode, serviceCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Entity
    expressApp.get("/shared/getEntity", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");
            const licenceId = req.query.licenceId;

            const result = await sharedService.getEntity(identityName, licenceId);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Files
    // https://attacomsian.com/blog/uploading-files-nodejs-express
    expressApp.post("/shared/uploadFiles", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            if(!(req.files)) {
                res.send({
                    message: "No file uploaded"
                });
            } else {
                let uids = await sharedService.uploadMultipleFiles(identityName, req.files);
                res.status(200).json(uids);
            }
                // var uids = [];
                // var index = 0;
                // while(true) {
                //     let file = req.files['file[' + index + ']'];
                //     if (file === undefined) {
                //         break;
                //     } else {
                //         let uid = await sharedService.uploadFile(identityName, file, file.name);

                //         if (uid !== null) {
                //             uids.push(uid);
                //             index++;
                //         } else {
                //             throw new Error(`File with name ${file.name} wasn\'t uploaded. Terminated.`);
                //         }
                //     }
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/shared/getFile", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");
            const fileId = req.query.fileId;

            let result = await sharedService.readFile(identityName, fileId);
            res.set('filename', result['filename']);
            res.set('mimeType', result['mime']);
            if (result['tempPath'] !== undefined) {
                res.download(result['tempPath'], function(err){
                    if(err) {
                        if(res.headersSent) {

                        } else {
                            res.set('filename', result['filename']);
                        }
                    }
                });      
            } else {
                res.status(400).json({'message': `couldn\'t load file with id ${fileId}. Maybe the server is down...`})
            }
        } catch(error) {
            res.status(400).json(error);
        }
    });
}

module.exports = configureSharedServiceListners;