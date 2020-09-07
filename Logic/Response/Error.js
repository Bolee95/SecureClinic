'use strict';

class Error {
    
    constructor(obj) {
        Object.assign(this, obj);
    }

    getErrorDesc() {
        return this.errorMessage();
    }

    getErrorCode() {
        return this.errorCode();
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }


    static createError(code, message) {
        return new Error({ code, message });
    }
}

module.exports = Error;
