'use strict';

const State = require('./StateApi/state.js');

class Entity extends State {
    constructor(obj) {
        super(Entity.getClass(), [obj.licenceId]);
        Object.assign(this,obj);
    }

    getLicenceId() {
        return this.licenceId;
    }

    getEntityNameAndSurname() {
        return this.name + " " + this.surname;
    }

    getRole() {
        return this.role;
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

    static createInstance(licenceId, role, name, surname, hospitalName, hospitalCode) {
        return new Entity({licenceId, role, name, surname, hospitalName, hospitalCode});
    }

    static getClass() {
        return 'org.secureclinic.pacient';
    }
}

module.exports = Entity;