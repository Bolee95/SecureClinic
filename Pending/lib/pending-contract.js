/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PendingContract extends Contract {

    //==============================================================================================
    // Pacient PUBLIC functions
    //===============================================================================================
    async initLedger(ctx) {
        const pendingList = [
            {
                hospital_code: 'AB2',
                pendings: [
                    {
                    jmbg: '01234567890',
                    list_id: 'AB2QWES2',
                    service_code: 'S2',
                    ordination_code: 'QWE',
                    aprovers: [
                    {
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    },
                    {
                        role: 'Supervisor',
                        work_licence_id: 'adas1223'
                    }]
                    },
                    {
                        jmbg: '12356123123',
                        list_id: 'AB2QWES2',
                        service_code: 'S2',
                        ordination_code: 'QWE',
                        aprovers: [
                            {
                                role: 'Director of ordination',
                                work_licence_id: 'adas1223'
                            },
                            {
                                role: 'Supervisour',
                                work_licence_id: 'adas1223'
                            }
                        ]
                    },
                ]
            },  
            {
                hospital_code: 'CQ1',
                pendings: [
                {
                jmbg: '125324566234',
                list_id: 'AB2QWES2',
                service_code: 'S2',
                ordination_code: 'QWE',
                aprovers: [
                    {
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    }
                ]
            },]
            }
        ]

        for (let i = 0; i < pendingList.length; i++) {
            await ctx.stub.putState(pendingList[i].hospital_code, Buffer.from(JSON.stringify(pendingList[i])));
            console.info('Added --> ', pendingList[i]);
        }
        console.info('============== DONE: Init Ledger ================');
    }

    //===================================================================================================
    // CRUD functions
    //===================================================================================================
    async pendingExists(ctx, hospitalCode) {
        const buffer = await ctx.stub.getState(hospitalCode);
        return (!!buffer && buffer.length > 0);
    }

    async createPending(ctx, hospitalCode, value) {
        const exists = await this.pendingExists(ctx, hospitalCode);
        if (exists) {
            throw new Error(`The pending ${hospitalCode} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async readPending(ctx, hospitalCode) {
        const exists = await this.pendingExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The pending ${hospitalCode} does not exist`);
        }
        const buffer = await ctx.stub.getState(hospitalCode);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updatePending(ctx, hospitalCode, newValue) {
        const exists = await this.pendingExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The pending ${hospitalCode} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async deletePending(ctx, hospitalCode) {
        const exists = await this.pendingExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The pending ${hospitalCode} does not exist`);
        }
        await ctx.stub.deleteState(hospitalCode);
    }

}

module.exports = PendingContract;
