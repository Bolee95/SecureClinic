'use strict';

class Entity {
    constructor(obj) {
        Object.assign(this,obj);
    }

    getEnitityName() {
        return this.entityName;
    }

    getWorkingLicenceid() {
        return this.workingLicenceId;
    }

    getEnitityRole() {
        return this.entityRole;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(entityName, workingLicenceId, entityRole) {
        return new Entity({entityName,workingLicenceId,entityRole});
    }
}
module.exports = Entity;