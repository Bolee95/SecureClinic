'use strict';

class AcceptedPacient {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getPacientId() {
        return this.pacientLbo;
    }

    getPacientPlaceOfBirth() {  
        return this.pacientPlace;
    }

    getDateOfPlacement() {
        return this.dateOfPlacement;
    }

    getExpectedTimeWaitingDays() {
        return this.exceptedWaitingDays;
    }

    getPacientScreenName() {
        return this.pacientScreenName;
    }

    getPacientScore() {
        return this.pacientScore;
    }

    getMaxWaitingDate() {
        return this.maxWaitingDate;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(pacientLbo, pacientScreenName, pacientPlace, dateOfPlacement, pacientScore, maxWaitingDate) {
        return new AcceptedPacient({pacientLbo, pacientScreenName, pacientPlace, dateOfPlacement, pacientScore, maxWaitingDate });
    }
}
module.exports = AcceptedPacient;