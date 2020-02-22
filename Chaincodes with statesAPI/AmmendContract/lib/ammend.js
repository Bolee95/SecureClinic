'use strict';

const State = require('../../StateApi/state.js');

const AmmandType = {
    USER_INITED: 1,
    TEHNICAL: 2,
    MEDICAL: 3
}

class Ammend extends State {
    constructor(obj) {
        super(Ammend.getClass(), [obj.hospitalCode, obj.ammandId]);
        Object.assign(this,obj);
    }

    getHospitalCode() {
        return this.hospitalCode;
    }

    getAmmandId() {
        return this.ammandId;
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

    // Ammand Type Methods

    getAmmandType() {
        return this.ammandType;
    }

    setAmmandTypePacientInited() {
        this.ammandType = AmmandType.USER_INITED;
    }

    setAmmandTypeMedical() {
        this.ammandType = AmmandType.MEDICAL;
    }

    setAmmandTypeTehnical() {
        this.ammandType = AmmandType.TEHNICAL;
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
        return State.deserializeClass(data, Ammand);
    }

    static createInstance(ammandId, hospitalCode, pacientJmbg, action, neededEndorsments, listId, evidencesList, approversList) {
        return new Ammand({ ammandId, hospitalCode, pacientJmbg, action, neededEndorsments, listId, evidencesList, approversList});
    }

    static getClass() {
        return 'org.secureclinic.ammand';
    }
}
module.exports = Ammend;