'use strict';

const State = require('../../StateApi/state.js');

const AmmendType = {
    USER_INITED: 1,
    TEHNICAL: 2,
    MEDICAL: 3
}

class Ammend extends State {
    constructor(obj) {
        super(Ammend.getClass(), [obj.hospitalCode, obj.ammendId]);
        Object.assign(this,obj);
    }

    getHospitalCode() {
        return this.hospitalCode;
    }

    getAmmendId() {
        return this.ammendId;
    }

    getPacientJmbg() {
        return this.pacientJmbg;
    }

    getAction() {
        return this.action;
    }

    getNumberOfNeededEndrsments() {
        return this.neededEndorsments;
    }

    setNumberOfNeededEndorsments(endorsmentsValue) {
        this.neededEndorsments = endorsmentsValue;
    }

    getListId() {
        return this.getListId;
    }

    getEvidencesIds() {
        return this.evidencesList;
    }

    addEvicence(evidence) {
         this.evidencesList.push(evidence);
    }

    getListOfApprovers() {
        return this.approversList;
    }

    addApprover(approver) {
         this.approversList.push(approver);
    }

    // Ammend Type Methods

    getAmmendType() {
        return this.ammendType;
    }

    setAmmendTypePacientInited() {
        this.ammendType = AmmendType.USER_INITED;
    }

    setAmmendTypeMedical() {
        this.ammendType = AmmendType.MEDICAL;
    }

    setAmmendTypeTehnical() {
        this.ammendType = AmmendType.TEHNICAL;
    }

    // Utility Methods

    static fromBuffer(buffer) {
        return Ammend.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Ammend);
    }

    static createInstance(ammendId, hospitalCode, pacientJmbg, action, neededEndorsments, listId, evidencesList, approversList) {
        return new Ammend({ ammendId, hospitalCode, pacientJmbg, action, neededEndorsments, listId, evidencesList, approversList});
    }

    static getClass() {
        return 'org.secureclinic.ammend';
    }
}
module.exports = Ammend;