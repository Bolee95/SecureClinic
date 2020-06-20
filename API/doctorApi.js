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
        const uniqueId = formFields["uniqueId"];
        const city = formFields["city"];

        const result = await doctorService.addPacient(identityName, name, surname, lbo, jmbg, uniqueId, city);
        res.status(200).json(result);
    });

    expressApp.post("/doctor/changePacientStatusToPending", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];
        const hospitalName = formFields["hospitalName"];
        const waitingListCode = formFields["waitingListCode"];
        const hospitalCode = formFields["hospitalCode"];

        const result = await doctorService.changePacientStatusToPending(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode);
        res.status(200).json(result);
    });

    expressApp.post("/doctor/changePacientStatusToWaiting", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];
        const hospitalName = formFields["hospitalName"];
        const waitingListCode = formFields["waitingListCode"];
        const hospitalCode = formFields["hospitalCode"];

        const result = await doctorService.changePacientStatusToWaiting(identityName, pacientLbo, hospitalName, waitingListCode, hospitalCode);
        res.status(200).json(result);
    });

    expressApp.get("/doctor/getPacient/all", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const result = await doctorService.getAllPacients(identityName);
        res.status(200).json(result);
    });

    expressApp.post("/doctor/resetPacientWaitingStatus", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];

        const result = await doctorService.resetPacientWaitingStatus(identityName, pacientLbo);
        res.status(200).json(result);
    });

    // Pending
    expressApp.post("/doctor/createNewPending", async (req, res, err) => {
        const identityName = req.get("Identity_name");

        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];
        const pacientJbmg = formFields["pacientJbmg"];
        const hospitalCode = formFields["hospitalCode"];
        const serviceCode = formFields["serviceCode"];
        const ordinationCode = formFields["ordinationCode"];

        const result = await doctorService.createNewPending(identityName, pacientLbo, pacientJbmg, hospitalCode, serviceCode, ordinationCode);
        res.status(200).json(result);
    });
}

module.exports = configureDoctorServiceListners;