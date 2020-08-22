const doctorService = require("../Logic/Services/DoctorService");

function configureDoctorServiceListners(expressApp) {

    // Pacient
    expressApp.post("/doctor/addPacient", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const name = formFields["name"];
            const surname = formFields["surname"];
            const lbo = formFields["lbo"];
            const jmbg = formFields["jmbg"];
            const city = formFields["city"];

            const result = await doctorService.addPacient(identityName, name, surname, lbo, jmbg, city);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/doctor/changePacientStatusToPending", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientLbo = formFields["pacientLbo"];

            const result = await doctorService.changePacientStatusToPending(identityName, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
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
        try {
            const identityName = req.get("Identity_name");

            const result = await doctorService.getAllPacients(identityName);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.get("/doctor/getPacient/allForHospital", async (req, res, err) => {
        try {
            const identityName = req.get("Identity_name");
            const hospitalCode = req.query.hospitalCode;
            const result = await doctorService.getAllPacientsForHospital(identityName, hospitalCode);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    expressApp.post("/doctor/resetPacientWaitingStatus", async (req, res, err) => {
        try {   
            const identityName = req.get("Identity_name");

            const formFields = req.fields;
            const pacientLbo = formFields["pacientLbo"];

            const result = await doctorService.resetPacientWaitingStatus(identityName, pacientLbo);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });

    // Pending
    expressApp.post("/doctor/createNewPending", async (req, res, err) => {
        try {
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
            const score = formFields["score"];

            const result = await doctorService.createNewPending(identityName, pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, score);
            res.status(200).json(result);
        } catch(error) {
            res.status(400).json(error);
        }
    });
}

module.exports = configureDoctorServiceListners;