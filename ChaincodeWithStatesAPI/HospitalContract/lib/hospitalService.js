'use strict';

class HospitalService {
    constructor(obj) {
        Object.assign(this, obj);
    }

    getServiceName() {
        return this.serviceName;
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

    static createInstance(serviceName, serviceCode, dayCapacity) {
        return new HospitalService({serviceName, serviceCode, dayCapacity});
    }
}

module.exports = HospitalService;