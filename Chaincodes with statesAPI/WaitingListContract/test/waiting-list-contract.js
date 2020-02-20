/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { WaitingListContract } = require('..');
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

describe('WaitingListContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new WaitingListContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"waiting list 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"waiting list 1002 value"}'));
    });

    describe('#waitingListExists', () => {

        it('should return true for a waiting list', async () => {
            await contract.waitingListExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a waiting list that does not exist', async () => {
            await contract.waitingListExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createWaitingList', () => {

        it('should create a waiting list', async () => {
            await contract.createWaitingList(ctx, '1003', 'waiting list 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"waiting list 1003 value"}'));
        });

        it('should throw an error for a waiting list that already exists', async () => {
            await contract.createWaitingList(ctx, '1001', 'myvalue').should.be.rejectedWith(/The waiting list 1001 already exists/);
        });

    });

    describe('#readWaitingList', () => {

        it('should return a waiting list', async () => {
            await contract.readWaitingList(ctx, '1001').should.eventually.deep.equal({ value: 'waiting list 1001 value' });
        });

        it('should throw an error for a waiting list that does not exist', async () => {
            await contract.readWaitingList(ctx, '1003').should.be.rejectedWith(/The waiting list 1003 does not exist/);
        });

    });

    describe('#updateWaitingList', () => {

        it('should update a waiting list', async () => {
            await contract.updateWaitingList(ctx, '1001', 'waiting list 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"waiting list 1001 new value"}'));
        });

        it('should throw an error for a waiting list that does not exist', async () => {
            await contract.updateWaitingList(ctx, '1003', 'waiting list 1003 new value').should.be.rejectedWith(/The waiting list 1003 does not exist/);
        });

    });

    describe('#deleteWaitingList', () => {

        it('should delete a waiting list', async () => {
            await contract.deleteWaitingList(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a waiting list that does not exist', async () => {
            await contract.deleteWaitingList(ctx, '1003').should.be.rejectedWith(/The waiting list 1003 does not exist/);
        });

    });

});