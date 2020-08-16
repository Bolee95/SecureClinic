'use strict';

class HospitalOrdination {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getServiceName() {
        return this.ordinationName;
    }

    getServiceCode() {
        return this.ordinationCode;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(ordinationName, ordinationCode) {
        return new HospitalOrdination({ordinationName, ordinationCode});
    }
}

module.exports = HospitalOrdination;