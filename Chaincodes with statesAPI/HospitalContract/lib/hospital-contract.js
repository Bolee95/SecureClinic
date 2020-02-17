/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HospitalContract extends Contract {

    //===============================================================
    // Hospital PUBLIC functions
    //===============================================================
    async initLedger(ctx) {
        console.info("=================== START: Initialize of the ledger =========================");
        const hospitals = [
            {
                id: 'licen123sda',
                name: 'Opsta bolnica Leskovac',
                public: true,
                hospital_code: 'AB1',
                city: 'Leskovac',
                list_of_ordinations: [
                    'C2',
                    'G2',
                    'A3'
                ],
                services: [
                    {
                        code: 'A23',
                        day_capacity: 2
                    },
                    {
                        code: 'A53',
                        day_capacity: 1
                    },
                    {
                        code: 'A27',
                        day_capacity: 1
                    },
                ],
                enitities: [
                    {
                        name: 'Petar Petrovic',
                        role: 'Director',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Nenad Nenadovic',
                        role: 'Tech support',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Marko Markovic',
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Djordje Djordjevic',
                        role: 'Supervisor',
                        work_licence_id: 'adas1223'
                    }
                ]
            },
            {
                id: 'qweqqad1334',
                name: 'Kardiohirurgija Nis',
                public: true,
                hospital_code: 'AB8',
                city: 'Nis',
                list_of_ordinations: [
                    'C2',
                    'G2',   
                    'A3'
                ],
                services: [
                    {
                        code: 'A23',
                        day_capacity: 2
                    },
                    {
                        code: 'A53',
                        day_capacity: 1
                    },
                    {
                        code: 'A27',
                        day_capacity: 1
                    },
                ],
                enitities: [
                    {
                        name: 'Petar Petrovic',
                        role: 'Director',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Nenad Nenadovic',
                        role: 'Tech support',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Marko Markovic',
                        role: 'Director of ordination',
                        work_licence_id: 'adas1223'
                    },
                    {
                        name: 'Djordje Djordjevic',
                        role: 'Supervisor',
                        work_licence_id: 'adas1223'
                    }
                ]
            }
        ]

        for(let i = 0; i < hospitals.length; i++ ) {
            await ctx.stub.putState(hospitals[i].code, Buffer.from(JSON.stringify(hospitals[i])));
            console.info('Added --> ', hospitals[i]);
        }
        console.info("=================== DONE: Initialize of the ledger =========================");
    }

    async hospitalExists(ctx, hospitalCode) {
        const buffer = await ctx.stub.getState(hospitalCode);
        return (!!buffer && buffer.length > 0);
    }

    async createHospital(ctx, hospitalCode, value) {
        const exists = await this.hospitalExists(ctx, hospitalCode);
        if (exists) {
            throw new Error(`The hospital with code ${hospitalCode} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async readHospital(ctx, hospitalCode) {
        const exists = await this.hospitalExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The hospital ${hospitalCode} does not exist`);
        }
        const buffer = await ctx.stub.getState(hospitalCode);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateHospital(ctx, hospitalCode, newValue) {
        const exists = await this.hospitalsExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The hospital with code ${hospitalCode} does not exist`);
        }
        const buffer = Buffer.from(JSON.stringify(newValue));
        await ctx.stub.putState(hospitalCode, buffer);
    }

    async deleteHospital(ctx, hospitalCode) {
        const exists = await this.hospitalsExists(ctx, hospitalCode);
        if (!exists) {
            throw new Error(`The hospital with code ${hospitalCode} does not exist`);
        }
        await ctx.stub.deleteState(hospitalCode);
    }


async getAllHospitals(ctx) {
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
}

module.exports = HospitalContract;
