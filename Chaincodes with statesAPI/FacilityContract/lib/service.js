'use strict';

class Service {
    constructor(obj) {
        Object.assign(this, obj);
    }   

    getServiceCode() {
        return this.serviceCode;
    }

    getServiceName() {
        return this.serviceName;
    }

    getMaxWaitingTime() {
        return this.getMaxWaitingTime;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(serviceCode, serviceName, maxWaitingTime) {
        return new Service({serviceCode, serviceName, maxWaitingTime});
    }
}

module.exports = Service;