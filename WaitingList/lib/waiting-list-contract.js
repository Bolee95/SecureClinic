/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// WaitingList ID = Hospital_code + Ordination_code
const { Contract } = require('fabric-contract-api');

class WaitingListContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ==============');
        const lists = [
            {
                list_id: 'AB2QWE',
                ordination_code: 'QWE',
                hospital_code: 'AB2',
                pacients: [ 
                {
                    id: '21312sad34234sdf',
                    place: 2,
                    date_of_placement: '01.01.2020 12:22',
                    expected_time_waiting_days: 10,
                    pacient_score: 5.6
                },
                {
                    id: '55435234fdf344',
                    place: 1,
                    date_of_placement: '01.05.2020 16:00',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                },
                {
                    id: '12345sadwsr23r3',
                    place: 3,
                    date_of_placement: '05.05.2020 03:23',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                }
                ]
            },
            {
                list_id: '112ABA',
                ordination_code: '112',
                hospital_code: 'ABA',
                pacients: [ 
                {
                    id: '21312sad34234sdf',
                    place: 2,
                    date_of_placement: '01.01.2020 03:23',
                    expected_time_waiting_days: 10,
                    pacient_score: 5.6
                },
                {
                    id: '55435234fdf344',
                    place: 1,
                    date_of_placement: '01.05.2020 03:23',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                },
                {
                    id: '12345sadwsr23r3',
                    place: 3,
                    date_of_placement: '05.05.2020 03:23',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                }
                ]
            },
            {
                list_id: '1121G1',
                ordination_code: '112',
                hospital_code: '1G1',
                pacients: [ 
                {
                    id: '21312sad34234sdf',
                    place: 2,
                    date_of_placement: '01.01.2020 03:23',
                    expected_time_waiting_days: 10,
                    pacient_score: 5.6
                },
                {
                    id: '55435234fdf344',
                    place: 1,
                    date_of_placement: '01.05.2020 03:23',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                },
                {
                    id: '12345sadwsr23r3',
                    place: 3,
                    date_of_placement: '05.05.2020 03:23',
                    expected_time_waiting_days: 11,
                    pacient_score: 4.0
                }
                ]
            }
        ]

        for (let i=0; i < lists.length; i++) {
            await ctx.stub.putState(lists[i].list_id, Buffer.from(JSON.stringify(lists[i])));
            console.info('Added --> ', lists[i]);
        }
        console.info('============= DONE : Initialize Ledger ==============');
    }

    async waitingListExists(ctx, waitingListId) {
        const buffer = await ctx.stub.getState(waitingListId);
        return (!!buffer && buffer.length > 0);
    }

    async createWaitingList(ctx, waitingListId, value) {
        const exists = await this.waitingListExists(ctx, waitingListId);
        if (exists) {
            throw new Error(`The waiting list ${waitingListId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(waitingListId, buffer);
    }

    async readWaitingList(ctx, waitingListId) {
        const exists = await this.waitingListExists(ctx, waitingListId);
        if (!exists) {
            throw new Error(`The waiting list ${waitingListId} does not exist`);
        }
        const buffer = await ctx.stub.getState(waitingListId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateWaitingList(ctx, waitingListId, newValue) {
        const exists = await this.waitingListExists(ctx, waitingListId);
        if (!exists) {
            throw new Error(`The waiting list ${waitingListId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(waitingListId, buffer);
    }

    async deleteWaitingList(ctx, waitingListId) {
        const exists = await this.waitingListExists(ctx, waitingListId);
        if (!exists) {
            throw new Error(`The waiting list ${waitingListId} does not exist`);
        }
        await ctx.stub.deleteState(waitingListId);
    }

    async getAllPacients(ctx) {
        //https://fabric-shim.github.io/release-1.4/tutorial-using-iterators.html
        const startKey = '';
        const endKey = '';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async getAllWaitingListsForHospital(ctx, hospitalCode) {
        //https://fabric-shim.github.io/release-1.4/tutorial-using-iterators.html
        const startKey = hospitalCode + '000';
        const endKey = hospitalCode + 'zzz';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }    
    }
}

module.exports = WaitingListContract;
