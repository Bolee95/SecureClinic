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
                lbo: '123313123',
                current_waiting_status: 'NOT_ACTIVE',
                main_institution: 'Opsta bolnica Grdelica',
                intitution_code: 'OBG1',
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
                docs_id: {
                    '2sdaewq2331' : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                },
            }
        ];

        for (let i = 0; i < pacients.length; i++ ) {

            await ctx.stub.putState('Pacient-' + pacients[i].jmbg, Buffer.from(JSON.stringify(pacients[i])));
            await ctx.stub.putPrivateData(PACIENT_COLLECTION, pacients[i].jmbg, Buffer.from(JSON.stringify(pacientsPrivateData[i])));
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
                lbo: '2314613123',
                ID: 'q123dbft34324',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'NOT_ACTIVE',
                main_institution: 'Opsta bolnica Leskovac',
                waiting_list_code: '',
                institution_code: 'OBG1',
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
                lbo: '2314613123',
                ID: 'q123dbft34323',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'ACTIVE',
                main_institution: 'VMA Beograd',
                waiting_list_code: 'CD3',
                institution_code: 'OBG1',
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
                lbo: '2314613123',
                ID: 'q123dbft34321',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'NOT_ACTIVE',
                main_institution: 'Opsta bolnica Grdelica',
                waiting_list_code: '',
                institution_code: 'OBG1',
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
                lbo: '2314613123',
                ID: 'q123dbft343212',
                sick_history:
                {
                    MP1: 'N',
                    GP2: 'A',
                    AS1: 'N',
                    TF2: 'A'
                },
                current_waiting_status: 'WAITING',
                main_institution: 'Klicniki centar Nis',
                waiting_list_code: 'QA1',
                institution_code: 'OBG1',
                docs_id: {
                    Asdaewq2331 : 'V',
                    '23sdag34524' : 'I',
                    '2123sdt4532' : 'V'
                }
            },
        ];

        for (let i = 0; i < pacients.length; i++ ) {

            await ctx.stub.putState('Pacient-' + pacients[i].ID, Buffer.from(JSON.stringify(pacients[i])));
            console.info('Added ---> ', pacients[i]);
        }
        console.info('============== DONE: Init Ledger ================');
    }
    //===================================================================================================
    // CRUD functions
    //===================================================================================================
    async readPacient(ctx, pacientId) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (!exists) {
            throw new Error(`The pacient ${pacientId} does not exist`);
        }
        const buffer = await ctx.stub.getState(pacientId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async deletePacient(ctx, pacientId) {
        const exists = await this.pacientExists(ctx, pacientId);
        if (!exists) {
            throw new Error(`The pacient ${pacientId} does not exist`);
        }
        const buffer = await ctx.stub.deleteState(pacientId);
        return buffer;
    }

    async pacientExists(ctx, pacientId) {
        const buffer = await ctx.stub.getState(pacientId);
        return (!!buffer && buffer.length > 0);
    }

    async createPacient(ctx, name, surname, jmbg, lbo, uniqueID, mainInstitution)
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
            intitution_code: 'OBG1',
            waiting_list_code: '',
            docs_id: {}
        };

        const exists = await this.pacientExists('Pacient-' + uniqueID);
        if (exists)
        {
            throw new Error(`The pacient with id (${uniqueID}) already exists.`);
        }
        await ctx.stub.putState('Pacient-' + uniqueID, Buffer.from(JSON.stringify(pacient)));
        console.info('=============== END : Creating new Pacient in system ==============');
    }
    async updatePacientWaitingState(ctx, pacientId, waitingListCode, newWaitingStatus)
    {
        console.info('==================== START : Updating Pacient waiting status ===============');
        const pacientAsBytes = await ctx.stub.getState('Pacient-' + pacientId);
        if (!pacientAsBytes || pacientAsBytes.length === 0) {
            throw new Error(`Pacient with id ${pacientId} does not exist in db`);
        }
        let pacientJSON = JSON.parse(pacientAsBytes.toString());
        pacientJSON.waiting_list_code = waitingListCode;
        pacientJSON.current_waiting_status = newWaitingStatus;

        await ctx.stub.putState('Pacient-'+ pacientId, Buffer.from(JSON.stringify(pacientJSON)));
        console.info('=============== END : Updating Pacient waiting status ===============');
    }

    async updatePacientInstitution(ctx, pacientID, newInstitName, newInstitCode)
    {
        console.log('==================== START : Updating Pacient waiting status ===============');
        const pacientAsBytes = await ctx.stub.getState('Pacient-' + pacientID);
        if(!pacientAsBytes || pacientAsBytes.length ===0) {
            throw new Error(`Pacient with id ${pacientID} does not exist in db`);
        }
        let pacientJSON = JSON.parse(pacientAsBytes.toString());
        pacientJSON.main_institution = newInstitName;
        pacientJSON.institution_code = newInstitCode;

        await ctx.stub.putState('Pacient-' + pacientID, Buffer.from(JSON.stringify(pacientJSON)));
    }

    async getAllPacients(ctx) {
    //https://fabric-shim.github.io/release-1.4/tutorial-using-iterators.html
    //    const iterator = await ctx.stub.getQueryResult();
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

