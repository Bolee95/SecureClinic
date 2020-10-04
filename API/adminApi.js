const adminService = require("../Logic/Services/AdminService");

function configureAdminServiceListeners(expressApp) {

    //Ammends
    expressApp.get("/admin/getAmmend/all", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const result = await adminService.retrieveAllAmmends(identityName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Facility 
    expressApp.post("/admin/addServiceToFacility", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        // TODO extract data from body
        const facilityCode = formFields["facilityCode"];
        const serviceCode = formFields["serviceCode"];
        const serviceName = formFields["serviceName"];
        const maxWaitTime = formFields["maxWaitTime"];

        const result = await adminService.addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/addServiceToFacility/test", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const facilityCode = req.query.facilityCode;
        const serviceCode = req.query.serviceCode;
        const serviceName = req.query.serviceName;
        const maxWaitTime = req.query.maxWaitTime;

        const result = await adminService.addServiceToFacility(identityName, facilityCode, serviceCode, serviceName, maxWaitTime);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/createFacility", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const facilityName = formFields["facilityName"];
        const facilityCode = formFields["facilityCode"];

        const result = await adminService.createFacility(identityName, facilityName, facilityCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/createFacility/test", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const facilityName = req.query.facilityName;
        const facilityCode = req.query.facilityCode;

        const result = await adminService.createFacility(identityName, facilityName, facilityCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.get("/admin/getFacility", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const facilityCode = req.query.facilityCode;
        const result = await adminService.getFacility(identityName,facilityCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Hospital

    // Not used
    expressApp.post("/admin/addOrdinationToHospital", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const hospitalCode = formFields["hospitalCode"];
        const ordinationCode = formFields["ordinationCode"];

        const result = await adminService.addNewOrdiantionToHospital(identityName, hospitalCode, ordinationCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Not used
    expressApp.post("/admin/addServiceToHospital", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const hospitalCode = formFields["hospitalCode"];
        const serviceCode = formFields["serviceCode"];

        const result = await adminService.addNewServiceToHospital(identityName, hospitalCode, serviceCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/createHospital", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const hospitalName = formFields["hospitalName"];
        const hospitalCode = formFields["hospitalCode"];
        const privateOrPublic = formFields["privateOrPublic"];
        const city = formFields["city"];

        const result = await adminService.createHospital(identityName, hospitalName, hospitalCode, privateOrPublic, city);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/addNewService", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const hospitalCode = formFields["hospitalCode"];
        const ordinationName = formFields["ordinationName"];
        const ordinationCode = formFields["ordinationCode"];
        const serviceName = formFields["serviceName"];
        const serviceCode = formFields["serviceCode"];

        const result = await adminService.addNewServiceToHospital(identityName, hospitalCode, ordinationName, ordinationCode, serviceName, serviceCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    })

    // Network
    expressApp.post("/admin/registerUserWallet", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const userName = formFields["userName"];

        const result = await adminService.registerUser(identityName, userName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.delete("/admin/deleteUserWallet", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const username = formFields["username"];

        const result = await adminService.removeUser(identityName, username);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Pending
    expressApp.get("/admin/getPending/all", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const result = await adminService.retrieveAllAmmends(identityName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Entity
    expressApp.get("/admin/getEntity/all", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const result = await adminService.getAllEntities(identityName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/admin/createEntity", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const licenceId = formFields["licenceId"];
        const name = formFields["name"];
        const surname = formFields["surname"];
        const hospitalName = formFields["hospitalName"];
        const hospitalCode = formFields["hospitalCode"];
        const role = formFields["role"];

        const result = await adminService.createEntity(identityName, licenceId, name, surname, hospitalName, hospitalCode, role);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });
}

module.exports = configureAdminServiceListeners;
