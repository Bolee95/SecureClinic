'use strict';

const State = require('../../StateApi/state.js');

class Hospital extends State {
    constructor(obj) {
        super(Hospital.getClass(), [obj.hospitalCode]);
        Object.assign(this,obj);
    }

    getHospitalName() {
        return this.hospitalName;
    }

    getIsPublic() {
        return this.isPublic;
    }

    getCity() {
        return this.city;
    }

    getListOfOrdinations() {
        return this.ordinations;
    }

    getServices() {
        return this.services;
    }

    getEntities() {
        return this.entities;
    }

    addNewOrdination(ordination) {
        return this.ordinations.push(ordination);
    }

    addNewService(service) {
        return this.services.push(service);
    }

    addNewEntity(entity) {
        return this.entities.push(entity);
    }

    static fromBuffer(buffer) {
        return Hospital.deserialize(Buffer.from(JSON.parse(buffer)));
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

    static createInstance(hospitalName, hospitalCode, isPublic, city, ordinations, services, entities) {
        return new Hospital({ hospitalName, hospitalCode, isPublic, city, ordinations, services, entities});
    }

    static getClass() {
        return 'org.secureclinic.hospital';
    }
}
module.exports = Hospital;