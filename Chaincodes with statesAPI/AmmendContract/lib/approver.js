'use strict';

class Approver {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getRole() {
        return this.role;
    }

    getWorkingLicenceId() {
        return this.workingLicenceId;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(role, workingLicenceId) {
        return new Approver({ role, workingLicenceId });
    }
}
module.exports = Approver;