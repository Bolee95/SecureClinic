'use strict';

const State = require('../../StateApi/state.js');

class Facility extends State {

    constructor(obj) {
        super(Facility.getClass(), [obj.facilityCode]);
        Object.assign(this, obj);
    }

    getFacilityName() {
        return this.facilityName;
    }

    getFacilityCode() {
        return this.facilityCode;
    }

    getServices() {
        return this.services;
    }

    addService(service) {
        return this.services.push(service);
    }

    static fromBuffer(buffer) {
        return Facility.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Facility);
    }

    static createInstance(facilityName, facilityCode, services) {
        return new Facility({ facilityName, facilityCode, services});
    }

    static getClass() {
        return 'org.secureclinic.facility';
    }
}

module.exports = Facility;