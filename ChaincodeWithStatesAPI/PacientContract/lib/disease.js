'use strict';

class Disease {
    constructor(obj) {
        Object.assign(this,obj);
    }

    getDiseaseCode() {
        return this.diseaseCode;
    }

    getDiseaseName() {
        return this.diseaseName;
    }

    getIsDiseaseActive() {
        return this.isActive; 
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static createInstance(diseaseCode, diseaseName, active) {
        return new Disease({ diseaseCode, diseaseName, active });
    }
}
module.exports = Disease;