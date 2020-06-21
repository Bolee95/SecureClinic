const directorService = require("../Logic/Services/DirectorService");

function configureDirectorServiceListeners(expressApp) {

    // Pacient
    expressApp.delete("/director/deletePacient", async (req, res, err) => {
    try {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const pacientLbo = formFields["pacientLbo"];

        const result = await directorService.deletePacient(identityName, pacientLbo);
        res.status(200).json(result);
    } catch(error) {
        res.status(400).json(error);
      }
    });
}

module.exports = configureDirectorServiceListeners;
