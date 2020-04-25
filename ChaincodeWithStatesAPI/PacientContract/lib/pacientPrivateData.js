'use strict';

const State = require('../../StateApi/state.js');

class PacientPrivateData extends State {

    constructor(obj) {
        super(PacientPrivateData.getClass(),[obj.uniqueId]);
        Object.assign(this,obj);
    }

    getUniqueId() {
        return this.uniqueId;
    }

    getCardId() {
        return this.cardId;
    }

    getSicknessHistory() {
        return this.sicknessHistory;
    }

    getDocumentIds() {
        return this.documentIds;
    }

    addNewDocumentId(documentId) {
        this.documentsIds.push(documentId);
    }

    addNewDiseaseCode(diseaseCode) {
        this.sicknessHistory.push(diseaseCode);
    }

    static fromBuffer(buffer) {
        return Pacient.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Pacient);
    }

    static createInstance(uniqueId, cardId, sicknessHistory, documentsIds) {
        return new PacientPrivateData({uniqueId, cardId, sicknessHistory, documentsIds});
    }

    static getClass() {
        return 'org.secureclinic.pacientprivateData';
    }
}

module.exports = PacientPrivateData;