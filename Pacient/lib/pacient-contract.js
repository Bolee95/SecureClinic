/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const PACIENT_COLLECTION = 'collectionPacients';

class PacientContract extends Contract {

    //=========================================================================================
    // Private data functions
    //=========================================================================================
    async initLedgerWithPrivateData(ctx) {
        console.info('============= START : Initialize Ledger using private data ===========');

        const pacients = [
            {
                name: 'Bogdan',
                surname: 'Ilic',
                jmbg: '1234567890',
                lbo: '000000001',
                current_waiting_status: 'NOT_ACTIVE',
                hospital_name: 'Opsta bolnica Grdelica',
                hospital_code: 'OBG1',
                waiting_list_code: '',
            }
        ];
        const pacientsPrivateData = [
            {
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                ID: 'q123dbft34324',
                card_id: '2231000231',
                docs_id: {
                    '2sdaewq2331' : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                },
            }
        ];

        for (let i = 0; i < pacients.length; i++ ) {

            await ctx.stub.putState(pacients[i].lbo, Buffer.from(JSON.stringify(pacients[i])));
            await ctx.stub.putPrivateData(PACIENT_COLLECTION, pacients[i].lbo, Buffer.from(JSON.stringify(pacientsPrivateData[i])));
            console.info('Added ---> ', pacients[i]);
        }
        console.info('============== DONE: Initialize Ledger using private data ================');
    }

    async readPacientPrivateData(ctx, pacientJMBG) {
        console.info('============= START : Retrieve private data of pacient ===========');
        const exists = this.pacientPrivateDataExists(ctx, pacientJMBG);
        if (!exists) {
            throw new Error(`The pacient private data for jmbg: ${pacientJMBG} does not exist`);
        }
        const buffer = await ctx.stub.getPrivateData(PACIENT_COLLECTION, pacientJMBG);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async pacientPrivateDataExists(ctx, pacientJMBG) {
        const buffer = await ctx.stub.getPrivateData(PACIENT_COLLECTION, pacientJMBG);
        return (!!buffer && buffer.length > 0);
    }

    //==============================================================================================
    // Pacient PUBLIC functions
    //===============================================================================================

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        const pacients = [
            {
                name: 'Bogdan',
                surname: 'Ilic',
                jmbg: '1234567890',
                lbo: '000000002',
                ID: 'q123dbft34324',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'NOT_ACTIVE',
                hospital_name: 'Opsta bolnica Leskovac',
                waiting_list_code: '',
                hospital_code: 'OBG1',
                docs_id: {
                    Asdaewq2331 : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                }
            },
            {
                name: 'Darko',
                surname: 'Ilic',
                jmbg: '1234567890',
                lbo: '000000003',
                ID: 'q123dbft34323',
                card_id: '2231000231',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'ACTIVE',
                hospital_name: 'VMA Beograd',
                waiting_list_code: 'CD3',
                hospital_code: 'OBG1',
                docs_id: {
                    Asdaewq2331 : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                }
            },
            {
                name: 'Viktor',
                surname: 'Djikic',
                jmbg: '1234567890',
                lbo: '000000004',
                ID: 'q123dbft34321',
                card_id: '2231000231',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'NOT_ACTIVE',
                hospital_name: 'Opsta bolnica Grdelica',
                waiting_list_code: '',
                hospital_code: 'OBG1',
                docs_id: {
                    Asdaewq2331 : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                }
            },
            {
                name: 'Djordje',
                surname: 'Djordjevic',
                jmbg: '1234567890',
                lbo: '000000005',
                ID: 'q123dbft343212',
                card_id: '2231000231',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'WAITING',
                hospital_name: 'Klicniki centar Nis',
                waiting_list_code: 'QA1',
                hospital_code: 'OBG1',
                docs_id: {
                    Asdaewq2331 : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                }
            },
        ];

        for (let i = 0; i < pacients.length; i++ ) {

            await ctx.stub.putState(pacients[i].lbo, Buffer.from(JSON.stringify(pacients[i])));
            console.info('Added ---> ', pacients[i]);
        }
        console.info('============== DONE: Init Ledger ================');
    }
    //===================================================================================================
    // CRUD functions
    //===================================================================================================
    async readPacient(ctx, lbo) {
        const exists = await this.pacientExists(ctx, lbo);
        if (!exists) {
            throw new Error(`The pacient with lbo ${lbo} does not exist`);
        }
        const buffer = await ctx.stub.getState(lbo);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async deletePacient(ctx, lbo) {
        const exists = await this.pacientExists(ctx, lbo);
        if (!exists) {
            throw new Error(`The pacient with lbo ${lbo} does not exist`);
        }
        const buffer = await ctx.stub.deleteState(lbo);
        return buffer;
    }

    async pacientExists(ctx, lbo) {
        const buffer = await ctx.stub.getState(lbo);
        return (!!buffer && buffer.length > 0);
    }

    async createPacientShort(ctx, lbo, value) {
        const exists = await this.pacientExists(ctx, lbo);
        if (exists) {
            throw new Error(`The pacient with lbo ${lbo} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(lbo, buffer);
    }

    async createPacient(ctx, name, surname, jmbg, lbo, uniqueID, mainInstitution, institutionCode)
    {
        console.info('============== START : Creating new Pacient in system ===============');

        const pacient = {
            name,
            surname,
            jmbg,
            lbo,
            uniqueID,
            sick_history: {},
            current_waiting_status: 'NOT_ACTIVE',
            mainInstitution,
            institutionCode,
            waiting_list_code: '',
            docs_id: {}
        };

        const exists = await this.pacientExists(ctx, lbo);
        if (exists)
        {
            throw new Error(`The pacient with lbo (${lbo}) already exists.`);
        }
        let result = ctx.stub.putState(lbo, Buffer.from(JSON.stringify(pacient)));
        console.info('=============== END : Creating new Pacient in system ==============');
        return result;
    }
    async updatePacientWaitingState(ctx, lbo, waitingListCode, newWaitingStatus)
    {
        console.info('==================== START : Updating Pacient waiting status ===============');
        const pacientAsBytes = await ctx.stub.getState(lbo);
        if (!pacientAsBytes || pacientAsBytes.length === 0) {
            throw new Error(`Pacient with lbo ${lbo} does not exist in db`);
        }
        let pacientJSON = JSON.parse(pacientAsBytes.toString());
        pacientJSON.waiting_list_code = waitingListCode;
        pacientJSON.current_waiting_status = newWaitingStatus;

        await ctx.stub.putState(lbo, Buffer.from(JSON.stringify(pacientJSON)));
        console.info('=============== END : Updating Pacient waiting status ===============');
    }

    async updatePacientInstitution(ctx, lbo, newInstitName, newInstitCode)
    {
        console.log('==================== START : Updating Pacient waiting status ===============');
        const pacientAsBytes = await ctx.stub.getState(lbo);
        if(!pacientAsBytes || pacientAsBytes.length ===0) {
            throw new Error(`Pacient with lbo ${lbo} does not exist in db`);
        }
        let pacientJSON = JSON.parse(pacientAsBytes.toString());
        pacientJSON.hospital_name = newInstitName;
        pacientJSON.hospital_code = newInstitCode;

        await ctx.stub.putState(lbo, Buffer.from(JSON.stringify(pacientJSON)));
    }

    async updatePacient(ctx, lbo, newValue) {
    const exists = await this.pacientExists(ctx, lbo);
     if (!exists) {
        throw new Error(`Pacient with lbo ${lbo} does not exist`);
    }
        const asset = { newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(lbo, buffer);
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
}

module.exports = PacientContract;

