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

    getPacientScore() {
        return this.pacientScore;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(pacientLbo, pacientPlace, dateOfPlacement, pacientScore) {
        return new AcceptedPacient({pacientLbo, pacientPlace, dateOfPlacement, pacientScore });
    }
}
module.exports = AcceptedPacient;