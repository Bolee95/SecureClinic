
'use strict';

const State = require('./StateApi/state.js');

class Statistic extends State {
    constructor(obj) {
        super(Statistic.getClass(), [obj.hospitalCode]);
        Object.assign(this, obj);
    }

    getArrayOfStats() {
        return this.stats;
    }

    addNewStat(newStat) {
        this.stats.push(newStat);
    }

    getHospitalCode() {
        return this.hospitalCode;
    }
    /**
     * Setter methods for pacient waiting state
    */

    static fromBuffer(buffer) {
        return Statistic.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Statistic);
    }

    static createInstance(hospitalCode, stats) {
        return new Statistic({hospitalCode, stats});
    }

    static getClass() {
        return 'org.secureclinic.statistic';
    }
}

module.exports = Statistic;