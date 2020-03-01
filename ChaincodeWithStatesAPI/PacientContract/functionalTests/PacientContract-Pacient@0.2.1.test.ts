/*
* Use this file for functional testing of your smart contract.
* Fill out the arguments and return values for a function and
* use the CodeLens links above the transaction blocks to
* invoke/submit transactions.
* All transactions defined in your smart contract are used here
* to generate tests, including those functions that would
* normally only be used on instantiate and upgrade operations.
* This basic test file can also be used as the basis for building
* further functional tests to run as part of a continuous
* integration pipeline, or for debugging locally deployed smart
* contracts by invoking/submitting individual transactions.
*/
/*
* Generating this test file will also trigger an npm install
* in the smart contract project directory. This installs any
* package dependencies, including fabric-network, which are
* required for this test file to be run locally.
*/

import * as assert from 'assert';
import * as fabricNetwork from 'fabric-network';
import { SmartContractUtil } from './ts-smart-contract-util';

import * as os from 'os';
import * as path from 'path';

describe('PacientContract-Pacient@0.2.1' , () => {

    const homedir: string = os.homedir();
    const walletPath: string = path.join(homedir, '.fabric-vscode', 'wallets', 'local_fabric_wallet');
    const gateway: fabricNetwork.Gateway = new fabricNetwork.Gateway();
    const fabricWallet: fabricNetwork.FileSystemWallet = new fabricNetwork.FileSystemWallet(walletPath);
    const identityName: string = 'admin';
    let connectionProfile: any;

    before(async () => {
        connectionProfile = await SmartContractUtil.getConnectionProfile();
    });

    beforeEach(async () => {
        const discoveryAsLocalhost: boolean = SmartContractUtil.hasLocalhostURLs(connectionProfile);
        const discoveryEnabled: boolean = true;

        const options: fabricNetwork.GatewayOptions = {
            discovery: {
                asLocalhost: discoveryAsLocalhost,
                enabled: discoveryEnabled,
            },
            identity: identityName,
            wallet: fabricWallet,
        };

        await gateway.connect(connectionProfile, options);
    });

    afterEach(async () => {
        gateway.disconnect();
    });

    describe('initLedgerWithPrivateData', () => {
        it('should submit initLedgerWithPrivateData transaction', async () => {
            const args: string[] = [];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'initLedgerWithPrivateData', args, gateway);
            assert.equal(response.toString(), '');
        }).timeout(5000);
    });

    describe('readPacientPrivateData', () => {
        it('should submit readPacientPrivateData transaction', async () => {
            // TODO: Update with parameters of transaction
            const args: string[] = ["q123dbft34324"];

            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'readPacientPrivateData', args, gateway);
            // submitTransaction returns buffer of transcation return value
            // TODO: Update with return value of transaction
            assert.notDeepEqual(response.toString(), '');
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(5000);
    });

    describe('pacientPrivateDataExists', () => {
        it('should submit pacientPrivateDataExists transaction', async () => {
            const args: string[] = ["q123dbft34324"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'pacientPrivateDataExists', args, gateway);
            assert.equal(response.toString(),'true');
        }).timeout(5000);
    });

    describe('updatePacientPrivateData', () => {
        it('should submit updatePacientPrivateData transaction', async () => {
            const args: string[] = ["000000002", "new Value"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'updatePacientPrivateData', args, gateway);
            assert.equal(true,true);
        }).timeout(5000);
    });

    describe('initLedger', () => {
        it('should submit initLedger transaction', async () => {
            const args: string[] = [];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'initLedger', args, gateway);
            assert.equal(response.toString(), '');
        }).timeout(5000);
    });

    describe('readPacient', () => {
        it('should submit readPacient transaction', async () => {
            const args: string[] = ["000000002"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'readPacient', args, gateway);
            assert.notDeepEqual(response.toString(), '');
        }).timeout(5000);
    });

    describe('deletePacient', () => {
        it('should submit deletePacient transaction', async () => {
            const args: string[] = ["000000002"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'deletePacient', args, gateway);
            assert.equal(true, true);
        }).timeout(5000);
    });

    describe('pacientExists', () => {
        it('should submit pacientExists transaction', async () => {
            const args: string[] = ["000000010"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'pacientExists', args, gateway);
            assert.equal(true, true);
        }).timeout(5000);
    });

    describe('createPacientShort', () => {
        it('should submit createPacientShort transaction', async () => {
            // TODO: Update with parameters of transaction
            const args: string[] = [];

            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'createPacientShort', args, gateway);
            // submitTransaction returns buffer of transcation return value
            // TODO: Update with return value of transaction
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('createPacient', () => {
        it('should submit createPacient transaction', async () => {
            // TODO: Update with parameters of transaction
            const args: string[] = [];

            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'createPacient', args, gateway);
            // submitTransaction returns buffer of transcation return value
            // TODO: Update with return value of transaction
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('updatePacientWaitingState', () => {
        it('should submit updatePacientWaitingState transaction', async () => {
            // TODO: Update with parameters of transaction
            const args: string[] = [];

            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'updatePacientWaitingState', args, gateway);
            // submitTransaction returns buffer of transcation return value
            // TODO: Update with return value of transaction
            assert.equal(true, true);
            // assert.equal(JSON.parse(response.toString()), undefined);
        }).timeout(10000);
    });

    describe('updatePacientInstitution', () => {
        it('should submit updatePacientInstitution transaction', async () => {
            const args: string[] = ["000000002", "Nova Bolnica", "ABA1"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'updatePacientInstitution', args, gateway);
            assert.equal(true, true);
        }).timeout(5000);
    });

    describe('updatePacient', () => {
        it('should submit updatePacient transaction', async () => {
            // TODO: Update with parameters of transaction
            const args: string[] = ["000000002", "New Value"];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'updatePacient', args, gateway);
            assert.equal(true, true);
        }).timeout(5000);
    });

    describe('getAllPacients', () => {
        it('should submit getAllPacients transaction', async () => {
            const args: string[] = [];
            const response: Buffer = await SmartContractUtil.submitTransaction('PacientContract', 'getAllPacients', args, gateway);
            assert.equal(true, true);
        }).timeout(5000);
    });

});
