'use strict';

const State = require('./StateApi/state.js');

const AmmendType = {
    USER_INITED: 1,
    TEHNICAL: 2,
    MEDICAL: 3
}

class Ammend extends State {
    constructor(obj) {
        super(Ammend.getClass(), [obj.hospitalCode, obj.ordinationCode, obj.serviceCode, obj.pacientLbo]);
        Object.assign(this,obj);
    }

    getHospitalCode() {
        return this.hospitalCode;
    }

    getOrdinationCode() {
        return this.ordinationCode;
    }

    getServiceCode() {
        return this.ordinationCode;
    }

    getPacientLbo() {
        return this.pacientLbo;
    }

    getAction() {
        return this.action;
    }

    addEvicence(evidence) {
        this.evidences.push(evidence);
    }

    getEvidencesIds() {
        return this.evidences;
    }

    getListOfApprovers() {
        return this.approvers;
    }

    getDescription() {
        return this.description;
    }

    getIsReviewed() {
        return this.isReviewed;
    }

    addApprover(approver) {
         this.approvers.push(approver);
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

    static createInstance(hospitalCode, ordinationCode, serviceCode, pacientLbo, action, description, evidences, approvers, isReviewed) {
        return new Ammend({ hospitalCode, ordinationCode, serviceCode, pacientLbo, action, description, evidences, approvers, isReviewed });
    }

    static getClass() {
        return 'org.secureclinic.ammend';
    }
}
module.exports = Ammend;