'use strict';

const PrivateStateList = require('./StateApi/privatestatelist.js');
const PacientPrivateData = require('./pacientPrivateData.js');
const PACIENT_COLLECTION_NAME = 'collectionPacients';

class PacientPrivateDataList extends PrivateStateList {

    constructor(ctx) {
        super(ctx, 'org.secureclinic.pacientprivatedatalist', PACIENT_COLLECTION_NAME);
        this.use(PacientPrivateData);
    }

    async addPacientPrivateData(pacientPrivateData) {
        return this.addPrivateState(pacientPrivateData);
    }

    async getPacientPrivateData(pacientKey) {
        return this.getPrivateState(pacientKey);
    }

    async updatePacientPrivateData(pacientPrivateData) {
        return this.updatePrivateState(pacientPrivateData);
    }    

    async privateDataExists(pacientKey) {
        return this.privateStateExists(pacientKey);
    }
}

module.exports = PacientPrivateDataList;