const directorService = require("../Logic/Services/DirectorService");

function configureDirectorServiceListeners(expressApp) {

    // Pacient
    expressApp.delete("/director/deletePacient", async (req, res, err) => {
        const identityName = req.get("Identity_name");
        const formFields = req.fields;
        const username = formFields["username"];

        const result = await directorService.removeUser(identityName,username);
        res.status(200).json(result);
    });
}

module.exports = configureDirectorServiceListeners;