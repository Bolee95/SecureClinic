'use strict';

class HospitalService {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getServiceCode() {
        return this.serviceCode;
    }

    getDayCapacity() {
        return this.dayCapacity;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(serviceCode, dayCapacity) {
        return new HospitalService({serviceCode, dayCapacity});
    }
}

module.exports = HospitalService;