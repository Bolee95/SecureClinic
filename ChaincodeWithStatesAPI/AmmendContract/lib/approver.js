'use strict';

class Approver {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getRole() {
        return this.role;
    }

    getWorkingLicenceId() {
        return this.licenceId;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(role, licenceId) {
        return new Approver({ role, licenceId });
    }
}
module.exports = Approver;