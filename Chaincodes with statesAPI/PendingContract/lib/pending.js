'use strict';

const State = require('../../StateApi/state.js');

class Pending extends State {
    constructor(obj) {
        super(Pending.getClass(), [obj.hospitalCode, obj.serviceCode, obj.ordinationCode, obj.pacientLbo]);
        Object.assign(this, obj);
    }

    getListId() {
        return this.listId;
    }

    getPacientJmbg() {
        return this.pacientJmbg;
    }

    getPacientLbo() {
        return this.pacientLbo;
    }

    getHospitalCode() {
        return this.hospitalCode;
    }

    getServiceCode() {
        return this.serviceCode;
    }

    getOrdinationCode() {
        return this.ordinationCode;
    }

    getApprovers() {
        return this.approvers;
    }

    addApprover(approver) {
        return this.approver.push(approver);
    }

    setPacientLbo(lbo) {
        this.pacientLbo = lbo;
    }

    setPacientJmbg(jmbg) {
        this.pacientJmbg = jmbg;
    }

    static fromBuffer(buffer) {
        return Pending.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }


    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Pending);
    }

    static createInstance(listId, pacientLbo, pacientJmbg, hospitalCode, serviceCode, ordinationCode, approvers) {
        return new Pending({listId ,pacientLbo, pacientJmbg, hospitalCode, serviceCode, ordinationCode, approvers});
    }

    static getClass() {
        return 'org.secureclinic.pending';
    }
}
module.exports = Pending;