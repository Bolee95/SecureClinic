'use strict';
const State = require('./state.js');

class PrivateStateList {

    constructor(ctx, privateListName, collectionName) {
        this.ctx = ctx;
        this.name = privateListName;
        this.supportedClasses = {};
        this.collectionName = collectionName;
    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addPrivateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putPrivateData(this.collectionName, key, data);
        return true;
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getPrivateState(key) {
        let makeKey = State.makeKey(key);
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getPrivateData(this.collectionName, ledgerKey);
        if (data.length > 0) {
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }
    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updatePrivateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putPrivateData(this.collectionName, key, data);
        return true;
    }


    async privateStateExists(key) {
        let primaryKey = State.makeKey(key);
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(primaryKey));
        let data = await this.ctx.stub.getPrivateData(this.collectionName,ledgerKey);
        if (data.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = PrivateStateList;