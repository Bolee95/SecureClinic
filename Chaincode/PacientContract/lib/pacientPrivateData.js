'use strict';

const State = require('./StateApi/state.js');

class PacientPrivateData extends State {

    constructor(obj) {
        super(PacientPrivateData.getClass(),[obj.lbo]);
        Object.assign(this,obj);
    }

    getLbo() {
        return this.lbo;
    }

    getScreenName() {
        return this.screenName;
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

    addNewDiseaseCode(disease) {
        this.sicknessHistory.push(disease);
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

    static createInstance(lbo, cardId, screenName, sicknessHistory, documentsIds) {
        return new PacientPrivateData({lbo, cardId, screenName, sicknessHistory, documentsIds});
    }

    static getClass() {
        return 'org.secureclinic.pacientprivateData';
    }
}

module.exports = PacientPrivateData;