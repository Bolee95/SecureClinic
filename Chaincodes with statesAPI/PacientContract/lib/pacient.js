
'use strict';

const State = require('../../StateApi/state.js');

const waitingState = {
    NONACTIVE: 1,
    PENDING: 2,
    ACTIVE: 3,
    REMOVED: 4
}

class Pacient extends State {
    constructor(obj) {
        super(Pacient.getClass(), [obj.lbo]);
        Object.assign(this, obj);
    }

    getCurrentWaitingStatus() {
        return this.currentWaitingStatus;
    }

    setCurrentWaitingStatus(newWaitingStatus) {
        this.currentWaitingStatus = newWaitingStatus;
    }

    setWaitingListCode(newCode) {
        this.waitingListCode = newCode;
    }

    setHospitalCode(newCode) {
        this.hospitalCode = newCode;
    }

    setHospitalName(newName) {
        this.hospitalName = newName;
    }

    getNameAndSurname() {
        return this.name + " " + this.surname;
    }

    /**
     * Setter methods for pacient waiting state
    */

    setWaitingStatusNonactive() {
        this.currentWaitingStatus = waitingState.NONACTIVE;
    }

    setWaitingStatusActive() {
        this.currentWaitingStatus = waitingState.ACTIVE;
    }

    setWaitingStatusPending() {
        this.currentWaitingStatus = waitingState.PENDING
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

    static createInstance(name, surname, lbo, jmbg, uniqueId, city, currentWaitingStatus, hospitalName, waitingListCode, hospitalCode) {
        return new Pacient({name ,surname, lbo, jmbg, uniqueId, city, currentWaitingStatus, hospitalName, waitingListCode, hospitalCode})
    }

    static getClass() {
        return 'org.secureclinic.pacient';
    }
}

module.exports = Pacient;