/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PacientContract2 extends Contract {

    async pacientExists(ctx, pacientId) {
        const buffer = await ctx.stub.getState(pacientId);
        return (!!buffer && buffer.length > 0);
    }

    async createPacient(ctx, pacientId, value) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (exists) {
            throw new Error(`The pacient ${pacientId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(pacientId, buffer);
    }

    async readPacient(ctx, pacientId) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (!exists) {
            throw new Error(`The pacient ${pacientId} does not exist`);
        }
        const buffer = await ctx.stub.getState(pacientId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updatePacient(ctx, pacientId, newValue) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (!exists) {
            throw new Error(`The pacient ${pacientId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(pacientId, buffer);
    }

    async deletePacient(ctx, pacientId) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (!exists) {
            throw new Error(`The pacient ${pacientId} does not exist`);
        }
        await ctx.stub.deleteState(pacientId);
    }

}

module.exports = PacientContract2;
