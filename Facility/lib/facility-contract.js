/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FacilityContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ==============');
        // Contains also services offered by that facility
        const facilities = [
            {
                name: 'Kardiohirurgija',
                code: 'A5',
                services: [
                    {
                        code: 'A5-22',
                        name: 'Operacija srca', 
                        max_waiting_time: 60,
                    },
                    {
                        code: 'A5-21',
                        name: 'Operacija zaliska',
                        max_waiting_time: 30,
                    },
                    {
                        code: 'A5-01',
                        name: 'Operacija aorte',
                        max_waiting_time: 10,
                    }
                ],
            },
            {
                name: 'Hirurgija',
                code: 'Q1',
                services: [
                    {
                        code: 'Q1-12',
                        name: 'Operacija kolena',
                        max_waiting_time: 180
                    },
                    {
                        code: 'Q1-45',
                        name: 'Operacija uva',
                        max_waiting_time: 300
                    }

                ]
            },
            {
                name: 'Oftamologija',
                code: 'O2',
                services: [
                    {
                        code: 'O2-22',
                        name: 'Operacija puza',
                        max_waiting_time: 300
                    }
                ]
            }
        ]

        for (let i = 0; i < facilities.length; i++) {
            await ctx.stub.putState(facilities[i].code, Buffer.from(JSON.stringify(facilities[i])));
            console.info('Added --> ', facilities[i]);
        }
        console.info('============= DONE : Initialize Ledger ==============');
    }

    async createService(ctx, newService) {
        // newService u formatu {"code: 'O2-11', name:'Operacija test', max_duration: 500"}
        const facility = await this.readFacility(ctx, 'O2');
        var newServiceJSON = newService;
        var arrayOfServices = facility.services;

        arrayOfServices.push(newServiceJSON);
        facility.services = arrayOfServices;
        await this.updateFacility(ctx, facility.code,  facility);
        return facility;

    }

    async facilityExists(ctx, facilityId) {
        const buffer = await ctx.stub.getState(facilityId);
        return (!!buffer && buffer.length > 0);
    }

    async createFacility(ctx, facilityId, value) {
        const exists = await this.facilityExists(ctx, facilityId);
        if (exists) {
            throw new Error(`The facility ${facilityId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(value));
        await ctx.stub.putState(facilityId, buffer);
    }

    async readFacility(ctx, facilityId) {
        const exists = await this.facilityExists(ctx, facilityId);
        if (!exists) {
            throw new Error(`The facility ${facilityId} does not exist`);
        }
        const buffer = await ctx.stub.getState(facilityId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateFacility(ctx, facilityId, newValue) {
        const exists = await this.facilityExists(ctx, facilityId);
        if (!exists) {
            throw new Error(`The facility ${facilityId} does not exist`);
        }
        const buffer = Buffer.from(JSON.stringify(newValue));
        await ctx.stub.putState(facilityId, buffer);
    }

    async deleteFacility(ctx, facilityId) {
        const exists = await this.facilityExists(ctx, facilityId);
        if (!exists) {
            throw new Error(`The facility ${facilityId} does not exist`);
        }
        await ctx.stub.deleteState(facilityId);
    }

    async getAllFacilities(ctx) {
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

module.exports = FacilityContract;
