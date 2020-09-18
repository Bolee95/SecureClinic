'use strict';

class ResponseError {
    
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
        return new ResponseError({ code, message });
    }
}

function getErrorFromResponse(respError) {
    // Chaincode error
    if (respError.endorsements != undefined) {
        let endorsment = respError.endorsements[0];
        let message = endorsment.message.split("Error:");
        return message.pop();
    } else {
        // Internal API error
        return respError.message;
    }
}

module.exports = {ResponseError, getErrorFromResponse};
