'use strict';

const State = require('./StateApi/state.js');

class WaitingList extends State {
    constructor(obj) {
        super(WaitingList.getClass(), [obj.hospitalCode, obj.serviceCode, obj.ordinationCode]);
        Object.assign(this,obj);
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

    static createInstance(hospitalCode, serviceCode, ordinationCode, pacients) {
        return new WaitingList({hospitalCode ,serviceCode, ordinationCode, pacients});
    }

    static getClass() {
        return 'org.secureclinic.waitingList';
    }
}
module.exports = WaitingList;
