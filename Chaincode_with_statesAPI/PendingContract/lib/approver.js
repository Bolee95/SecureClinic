'use strict';

class Approver {
    constructor(obj) {
        Object.assign(this,obj);
    }

    getApproverLicenceId() {
        return this.licenceId;
    }

    getApproverRole() {
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