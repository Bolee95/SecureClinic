'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Entity = require('./entity.js');
const EntityList = require('./enitityList.js');

class EntityContext extends Context {
    constructor() {
        super();
        this.entityList = new EntityList(this);
    }
}

class EntityContract extends Contract {

    constructor() {
        super('org.secureclinic.entity');
    }

    createContext() {
        return new EntityContext();
    }

    async instantiate(ctx) {
        let entity1 = Entity.createInstance('123qwerty', 'doctor', 'Bogdan', 'Ilic', 'Opsta Bolnica', 'AB1');
        let entity2 = Entity.createInstance('doctor', 'doctor', 'Darko', 'Ilic', 'Opsta Bolnica', 'AD');

        await ctx.entityList.addEntity(entity1);
        await ctx.entityList.addEntity(entity2);
    }

    async addEntity(ctx, entity) {
        const modeledEntity = Entity.fromJSON(entity, Entity);
        const entityExists = await ctx.entityList.entityExists(modeledEntity.licenceId);
        if (!entityExists) {
            const entityData = await ctx.entityList.addEntity(modeledEntity);
            return entityData;
        } else {
            throw new Error(`Entity with licenceId ${modeledEntity.licenceId} already exists`);
        }
    }

    async getEntity(ctx, licenceId) {
        let entityData = await ctx.entityList.getEntity(licenceId);
        return entityData;
    }

    async updateEntity(ctx, newEntity) {
        const modeledEntity = Entity.fromJSON(newEntity, Entity);
        let entity = await ctx.entityList.updateEntity(modeledEntity);
        return entity;
    }

    async removeEntity(ctx, licenceId) {
        let removedEntity = ctx.entityList.removeEntity(licenceId);
        return removedEntity;
    }

    async getAllEntities(ctx) {
        let allEntities = await ctx.entityList.getAllEntities();
        return new (Entity)(allEntities);
    }
}

module.exports = EntityContract;