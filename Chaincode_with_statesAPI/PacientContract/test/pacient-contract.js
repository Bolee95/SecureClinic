/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PacientContract } = require('../lib/pacient-contract.js');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('PacientContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new PacientContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('000000002').resolves(Buffer.from('{"value":"Pacient with lbo value of 000000002"}'));
    });

    describe('#pacientExists', () => {

        it('should return true for a pacient', async () => {
            await contract.pacientExists(ctx, '000000002').should.eventually.be.true;
        });

        it('should return false for a pacient that does not exist', async () => {
            await contract.pacientExists(ctx, '000000000').should.eventually.be.false;
        });

    });

    describe('#createPacientShort', () => {

        it('should create a pacient', async () => {
            await contract.createPacientShort(ctx, '0000000011', 'pacient 000000002 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('0000000011', Buffer.from('"pacient 000000002 value"'));
        });

        it('should throw an error for a pacient that already exists', async () => {
            await contract.createPacientShort(ctx, '000000002', 'myvalue').should.be.rejectedWith(/The pacient with lbo 000000002 already exists/);
        });

    });

    describe('#readPacient', () => {

        it('should return a pacient', async () => {
            await contract.readPacient(ctx, '000000002').should.eventually.deep.equal({ value: 'Pacient with lbo value of 000000002' });
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.readPacient(ctx, '000000000').should.be.rejectedWith(/The pacient with lbo 000000000 does not exist/);
        });

    });

    describe('#updatePacient', () => {
        it('should update a pacient', async () => {
            await contract.updatePacient(ctx, '000000002', 'pacient 000000002 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('000000002', Buffer.from('"pacient 000000002 new value"'));
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.updatePacient(ctx, '000000000', 'pacient 000000000 new value').should.be.rejectedWith(/Pacient with lbo 000000000 does not exist/);
        });

    });

    describe('#deletePacient', () => {

        it('should delete a pacient', async () => {
            await contract.deletePacient(ctx, '000000002');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('000000002');
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.deletePacient(ctx, '000000000').should.be.rejectedWith(/The pacient with lbo 000000000 does not exist/);
        });

    });

    // TO-DO
    /*
    describe('#getAllPacients', () => {
        it('Should return iterator for pacients', async() => {
            const iterator = await contract.getAllPacients(ctx);
            console.log(iterator);
        });
    });
    */
});