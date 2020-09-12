'use strict';

class Approver {
    constructor(obj) {
        Object.assign(this,obj);
    }

    getLicenceId() {
        return this.licenceId;
    }

    getRole() {
        return this.role;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(licenceId, role) {
        return new Approver({ licenceId, role });
    }
}
module.exports = Approver;