'use strict';

const State = require('./StateApi/state.js');

class Pending extends State {
    constructor(obj) {
        super(Pending.getClass(), [obj.hospitalCode, obj.ordinationCode, obj.serviceCode, obj.pacientLbo]);
        Object.assign(this, obj);
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

    getOrdinationCode() {
        return this.ordinationCode;
    }

    getServiceCode() {
        return this.serviceCode;
    }

    getApprovers() {
        return this.approvers;
    }

    addApprover(approver) {
        return this.approvers.push(approver);
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
    static createInstance(pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, approvers) {
        return new Pending({pacientLbo, pacientJmbg, pacientScreenName, hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, approvers});
    }

    static getClass() {
        return 'org.secureclinic.pending';
    }
}
module.exports = Pending;