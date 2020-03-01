/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { PendingContract } = require('..');
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

describe('PendingContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new PendingContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"pending 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"pending 1002 value"}'));
    });

    describe('#pendingExists', () => {

        it('should return true for a pending', async () => {
            await contract.pendingExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a pending that does not exist', async () => {
            await contract.pendingExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createPending', () => {

        it('should create a pending', async () => {
            await contract.createPending(ctx, '1003', 'pending 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"pending 1003 value"}'));
        });

        it('should throw an error for a pending that already exists', async () => {
            await contract.createPending(ctx, '1001', 'myvalue').should.be.rejectedWith(/The pending 1001 already exists/);
        });

    });

    describe('#readPending', () => {

        it('should return a pending', async () => {
            await contract.readPending(ctx, '1001').should.eventually.deep.equal({ value: 'pending 1001 value' });
        });

        it('should throw an error for a pending that does not exist', async () => {
            await contract.readPending(ctx, '1003').should.be.rejectedWith(/The pending 1003 does not exist/);
        });

    });

    describe('#updatePending', () => {

        it('should update a pending', async () => {
            await contract.updatePending(ctx, '1001', 'pending 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"pending 1001 new value"}'));
        });

        it('should throw an error for a pending that does not exist', async () => {
            await contract.updatePending(ctx, '1003', 'pending 1003 new value').should.be.rejectedWith(/The pending 1003 does not exist/);
        });

    });

    describe('#deletePending', () => {

        it('should delete a pending', async () => {
            await contract.deletePending(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a pending that does not exist', async () => {
            await contract.deletePending(ctx, '1003').should.be.rejectedWith(/The pending 1003 does not exist/);
        });

    });

});