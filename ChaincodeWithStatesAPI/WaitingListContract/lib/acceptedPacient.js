'use strict';

class AcceptedPacient {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getPacientId() {
        return this.pacientId;
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

    getPacientScore() {
        return this.pacientScore;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(pacientId, pacientPlace, dateOfPlacement, exceptedWaitingDays, pacientScore) {
        return new AcceptedPacient({pacientId, pacientPlace, dateOfPlacement, exceptedWaitingDays, pacientScore });
    }
}
module.exports = AcceptedPacient;