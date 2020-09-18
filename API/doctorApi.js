const doctorService = require("../Logic/Services/DoctorService");

function configureDoctorServiceListners(expressApp) {

    // Pacient
    expressApp.post("/doctor/addPacient", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const name = formFields["name"];
        const surname = formFields["surname"];
        const lbo = formFields["lbo"];
        const jmbg = formFields["jmbg"];
        const city = formFields["city"];
        const hospitalCode = formFields["hospitalCode"];
        const hospitalName = formFields["hospitalName"];

        const result = await doctorService.addPacient(identityName, name, surname, lbo, jmbg, city, hospitalCode, hospitalName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/doctor/changePacientStatusToPending", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];

        const result = await doctorService.changePacientStatusToPending(identityName, pacientLbo);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Skonjeno 16.08. Prebaceno u automatske metode kada se korisnik postavlja na listu cekanja
    // expressApp.post("/doctor/changePacientStatusToWaiting", async (req, res, err) => {
    //     try {
    //         const identityName = req.get("Identity_name");

    //         const formFields = req.fields;
    //         const pacientLbo = formFields["pacientLbo"];
    //         const hospitalName = formFields["hospitalName"];
    //         const waitingListCode = formFields["waitingListCode"];
    //         const hospitalCode = formFields["hospitalCode"];

    //         const result = await doctorService.changePacientStatusToWaiting(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode);
    //         res.status(200).json(result);
    //     } catch(error) {
    //         res.status(400).json(error);
    //     }
    // });

    expressApp.get("/doctor/getPacient/all", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const result = await doctorService.getAllPacients(identityName);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.get("/doctor/getPacient/allForHospital", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const hospitalCode = req.query.hospitalCode;
        const result = await doctorService.getAllPacientsForHospital(identityName, hospitalCode);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    expressApp.post("/doctor/resetPacientWaitingStatus", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];

        const result = await doctorService.resetPacientWaitingStatus(identityName, pacientLbo);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });

    // Pending
    expressApp.post("/doctor/createNewPending", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];
        const pacientJmbg = formFields["pacientJmbg"];
        const pacientScreenName = formFields["pacientScreenName"];
        const hospitalName = formFields["hospitalName"];
        const serviceName = formFields["serviceName"];
        const ordinationName = formFields["ordinationName"];
        const hospitalCode = formFields["hospitalCode"];
        const ordinationCode = formFields["ordinationCode"];
        const serviceCode = formFields["serviceCode"];
        const documentIds = formFields["documentIds"];
        const score = formFields["score"];

        const result = await doctorService.createNewPending(identityName, pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score, documentIds);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });
}

module.exports = configureDoctorServiceListners;