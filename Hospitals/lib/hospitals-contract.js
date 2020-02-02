/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalsContract extends Contract {

    async hospitalsExists(ctx, hospitalsId) {
        const buffer = await ctx.stub.getState(hospitalsId);
        return (!!buffer && buffer.length > 0);
    }

    async createHospitals(ctx, hospitalsId, value) {
        const exists = await this.hospitalsExists(ctx, hospitalsId);
        if (exists) {
            throw new Error(`The hospitals ${hospitalsId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalsId, buffer);
    }

    async readHospitals(ctx, hospitalsId) {
        const exists = await this.hospitalsExists(ctx, hospitalsId);
        if (!exists) {
            throw new Error(`The hospitals ${hospitalsId} does not exist`);
        }
        const buffer = await ctx.stub.getState(hospitalsId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateHospitals(ctx, hospitalsId, newValue) {
        const exists = await this.hospitalsExists(ctx, hospitalsId);
        if (!exists) {
            throw new Error(`The hospitals ${hospitalsId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalsId, buffer);
    }

    async deleteHospitals(ctx, hospitalsId) {
        const exists = await this.hospitalsExists(ctx, hospitalsId);
        if (!exists) {
            throw new Error(`The hospitals ${hospitalsId} does not exist`);
        }
        await ctx.stub.deleteState(hospitalsId);
    }

}

module.exports = HospitalsContract;
