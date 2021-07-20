'use strict';

const State = require('./StateApi/state.js');

class WaitingList extends State {
    constructor(obj) {
        super(WaitingList.getClass(), [obj.hospitalCode, obj.ordinationCode, obj.serviceCode]);
        Object.assign(this,obj);
    }

    getServiceName() {
        return this.serviceName;
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

    getAllPacients() {
        return this.pacients;
    }

    addNewPacient(pacient) {
        return this.pacients.push(pacient);
    }

    removePacient(pacient) {
        this.pacients = this.pacients.filter(function(value, index, arr) { return value != pacient.lbo})
    }

    static fromBuffer(buffer) {
        return WaitingList.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, WaitingList);
    }

    static createInstance(hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, pacients, maxWaitingDays) {
        return new WaitingList({hospitalName, ordinationName, serviceName, hospitalCode, ordinationCode, serviceCode, pacients, maxWaitingDays});
    }

    static getClass() {
        return 'org.secureclinic.waitingList';
    }
}
module.exports = WaitingList;
