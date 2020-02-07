/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class WaitingListAmmendContract extends Contract {

    //==============================================================================================
    // Pacient PUBLIC functions
    //===============================================================================================

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const ammends = [
            {
                hospital_code: 'AB1',
                ammands: [
                    {
                // Ammand_type moze da bude: 
                // - 'PACIENT_INITED' - iniciran od strane pacijenta
                // - 'TEHNICAL' - iniciran od strane eniteta odgovornog za tehniku
                // - 'MEDICAL' - iniciran od strane doktrora
                // Dodati jos neki ako je potrebno, za neko drugo osoblje
                    ammand_type: 'PACIENT_INITED', // 'TEHNICAL', 'MEDICAL'
                    pacient_jmbg: '123123142',
                    action: 'DELETE',
                    hospital_code: 'AB1',
                    list_id: 'AB2QWES2',
                    service_code: 'S2',
                    ordination_code: 'QWE',
                    evidencies_docs: [
                        'Asdaewq2331',
                        'safdsf324234',
                    ],
                    aprovers: [
                    {
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    },
                    {
                        role: 'Supervisor',
                        work_licence_id: 'adas1223'
                    }]
                     }
                    ]
                }, 
                {
                hospital_code: 'BB1',
                ammands: [
                    {
                    // Ammand_type moze da bude: 
                    // - 'PACIENT_INITED' - iniciran od strane pacijenta
                    // - 'TEHNICAL' - iniciran od strane eniteta odgovornog za tehniku
                    // - 'MEDICAL' - iniciran od strane doktrora
                    // Dodati jos neki ako je potrebno, za neko drugo osoblje
                    ammand_type: 'TEHNICAL', // 'TEHNICAL', 'MEDICAL'
                    action: 'MOVE',
                    action_duration_days: '5',
                    list_id: 'qw23134',
                    service_code: 'S2',
                    ordination_code: 'QWE',
                    evidencies_docs: [
                        'Asdaewq2331',
                        'safdsf324234',
                    ],
                    aprovers: [
                    {
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    },
                    {
                        role: 'Supervisor',
                        work_licence_id: 'adas1223'
                    }]
                    }   
                ]}
        ];

        for (let i = 0; i < ammends.length; i++ ) {

            await ctx.stub.putState(ammends[i].hospital_code, Buffer.from(JSON.stringify(ammends[i])));
            console.info('Added ---> ', ammends[i]);
        }
        console.info('============== DONE: Initialize Ledger using private data ================');
    }

    async waitingListAmmendExists(ctx, hospitalCode) {
        const buffer = await ctx.stub.getState(hospitalCode);
        return (!!buffer && buffer.length > 0);
    }

    async createWaitingListAmmend(ctx, hospitalCode, value) {
        const exists = await this.waitingListAmmendExists(ctx, hospitalCode);
        if (exists) {
            throw new Error(`The waiting list ammend ${hospitalCode} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async readWaitingListAmmend(ctx, hospitalCode) {
        const exists = await this.waitingListAmmendExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The waiting list ammend ${hospitalCode} does not exist`);
        }
        const buffer = await ctx.stub.getState(hospitalCode);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateWaitingListAmmend(ctx, hospitalCode, newValue) {
        const exists = await this.waitingListAmmendExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The waiting list ammend ${hospitalCode} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async deleteWaitingListAmmend(ctx, hospitalCode) {
        const exists = await this.waitingListAmmendExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The waiting list ammend ${hospitalCode} does not exist`);
        }
        await ctx.stub.deleteState(hospitalCode);
    }

}

module.exports = WaitingListAmmendContract;
