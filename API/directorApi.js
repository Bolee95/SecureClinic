const directorService = require("../Logic/Services/DirectorService");

function configureDirectorServiceListeners(expressApp) {

    // Pacient
    expressApp.delete("/director/deletePacient", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];

        const result = await directorService.deletePacient(identityName, pacientLbo);
        if (result.code === 400) { 
            res.status(400).json(result);
        } else {
            res.status(200).json(result);
        }
    });
}

module.exports = configureDirectorServiceListeners;
