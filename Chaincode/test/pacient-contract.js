/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PacientContract } = require('..');
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
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"pacient 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"pacient 1002 value"}'));
    });

    describe('#pacientExists', () => {

        it('should return true for a pacient', async () => {
            await contract.pacientExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a pacient that does not exist', async () => {
            await contract.pacientExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createPacient', () => {

        it('should create a pacient', async () => {
            await contract.createPacient(ctx, '1003', 'pacient 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"pacient 1003 value"}'));
        });

        it('should throw an error for a pacient that already exists', async () => {
            await contract.createPacient(ctx, '1001', 'myvalue').should.be.rejectedWith(/The pacient 1001 already exists/);
        });

    });

    describe('#readPacient', () => {

        it('should return a pacient', async () => {
            const test = await contract.readPacient(ctx, '1001').should.eventually.deep.equal({ value: 'pacient 1001 value' });
            console.log(test);
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.readPacient(ctx, '1003').should.be.rejectedWith(/The pacient 1003 does not exist/);
        });

    });

    describe('#updatePacient', () => {

        it('should update a pacient', async () => {
            await contract.updatePacient(ctx, '1001', 'pacient 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"pacient 1001 new value"}'));
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.updatePacient(ctx, '1003', 'pacient 1003 new value').should.be.rejectedWith(/The pacient 1003 does not exist/);
        });

    });

    describe('#deletePacient', () => {

        it('should delete a pacient', async () => {
            await contract.deletePacient(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a pacient that does not exist', async () => {
            await contract.deletePacient(ctx, '1003').should.be.rejectedWith(/The pacient 1003 does not exist/);
        });

    });

});