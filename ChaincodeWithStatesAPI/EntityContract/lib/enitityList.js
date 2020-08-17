'use strict';

const StateList = require('./StateApi/statelist.js');
const Entity = require('./entity.js');

class EntityList extends StateList {
    
    constructor(ctx) {
        super(ctx, 'org.secureclinic.entitylist');
        this.use(Entity);
    }

    async addEntity(entity) {
        return this.addState(entity);
    }

    async getEntity(licenceId) {
        return this.getState(licenceId);
    }

    async entityExists(licenceId) {
        return this.stateExists(licenceId);
    }

    async updateEntity(entity) {
        return this.updateState(entity);
    }

    async removeEntity(licenceId) {
        return this.deleteState(licenceId);
    }

    async getAllEntities() {
        return this.getAllStates();
    }
}

module.exports = EntityList;