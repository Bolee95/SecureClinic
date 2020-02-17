/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key which associates it with the container, rather
 * than the container containing a link to the state. This minimizes collisions
 * for parallel transactions on different states.
 */
class StateList {

    /**
     * Store Fabric context for subsequent API access, and name of list
     */
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data){
            let state = State.deserialize(data, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }

    /**
     * Remove state from worldstate
     */
    async deleteState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let pacientExists = await this.pacientExists(ledgerKey);
        if (pacientExists) {
            await this.ctx.stub.deleteState(ledgerKey);
            return true;
        } else {
            throw new Error("Pacient does not exist, so it can't be removed!");
        }
    }

    /**
     * Get all state of list without any criteria
    */
    async getAllStates() {
        //const compositeStartKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(startKey));
        //const compositeEndKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(endKey));
        const iterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, []);//await this.ctx.stub.getStateByRange(compositeStartKey, compositeEndKey);
        
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.key) {
                const Key = res.value.key;
                let Record;
                try {
                    console.log(res.value.value.toString('utf8'));
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push(Record);
            }
            if (res.done) {
                await iterator.close();
                return allResults;
            }
        }
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Checks if state with passed key already exists in worldstate 
     */
    async stateExists(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data){
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

module.exports = StateList;