'use strict';
// Pacient
const deletePacient = require('../Director/Pacient/deletePacient');

class DirectorService {

    async deletePacient(identityName, pacientLbo) {
        const result = await deletePacient(identityName, pacientLbo);
        return result;
    }
}

module.exports = DirectorService;