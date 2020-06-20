/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

/**
 * State class. States have a class, unique key, and a lifecycle current state
 * the current state is determined by the specific subclass
 */
class State {

    /**
     * @param {String|Object} class  An indentifiable class of the instance
     * @param {keyParts[]} elements to pull together to make a key for the objects
     */
    constructor(stateClass, keyParts) {
        this.class = stateClass;
        this.key = State.makeKey(keyParts);
        this.currentState = null;
    }

    getClass() {
        return this.class;
    }

    getKey() {
        return this.key;
    }

    getSplitKey(){
        return State.splitKey(this.key);
    }

    getCurrentState(){
        return this.currentState;
    }

    serialize() {
        return State.serialize(this);
    }

    /**
     * Convert object to buffer containing JSON data serialization
     * Typically used before putState()ledger API
     * @param {Object} JSON object to serialize
     * @return {buffer} buffer with the data to store
     */
    static serialize(object) {
        return Buffer.from(JSON.stringify(object));
    }

    /**
     * Deserialize object into one of a set of supported JSON classes
     * i.e. Covert serialized data to JSON object
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param (supportedClasses) the set of classes data can be serialized to
     * @return {json} json with the data to store
     */
    static deserialize(data, supportedClasses) {
        let json = JSON.parse(data.toString());
        let objClass = supportedClasses[json.class];
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        let object = new (objClass)(json);

        return object;
    }

    /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @return {json} json with the data to store
     */
    static deserializeClass(data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    }

    /**
     * Stringify created class so that it can be used to
     * be passed around like string. Later, it can be
     * return back to object by parsing JSON from string
     * and casted to proper class.
     */
    stringifyClass() {
        return JSON.stringify(this);
    }

     /**
     * Constructs a specific State object from string data
     * that should represent stringified object of specific State instance
     * @param {string} stringData Stringifed object
     */
    fromJSON(stringData, objClass) {
        return State.fromJSON(stringData, objClass);
    }

    /**
     * Static method that constructs a specific State object from string data
     * that should represent stringified object of specific State instance
     * @param {string} stringData Stringifed object
     */
    static fromJSON(stringData, objClass) {
        return new (objClass)(JSON.parse(stringData));
    }

    /**
     * Join the keyParts to make a unififed string
     * @param (String[]) keyParts
     */
    static makeKey(keyParts) {
        if (!Array.isArray(keyParts)) {
            return keyParts;
        }
        const reducer = (accumulator, currentValue) => accumulator + ':' + currentValue;
        const key = keyParts.reduce(reducer);
        return key;
    }

    static splitKey(key){
        return key.split(':');
    }

}
module.exports = State;