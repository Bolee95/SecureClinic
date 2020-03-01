/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { WaitingListAmmendContract } = require('..');
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

describe('WaitingListAmmendContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new WaitingListAmmendContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"waiting list ammend 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"waiting list ammend 1002 value"}'));
    });

    describe('#waitingListAmmendExists', () => {

        it('should return true for a waiting list ammend', async () => {
            await contract.waitingListAmmendExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a waiting list ammend that does not exist', async () => {
            await contract.waitingListAmmendExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createWaitingListAmmend', () => {

        it('should create a waiting list ammend', async () => {
            await contract.createWaitingListAmmend(ctx, '1003', 'waiting list ammend 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"waiting list ammend 1003 value"}'));
        });

        it('should throw an error for a waiting list ammend that already exists', async () => {
            await contract.createWaitingListAmmend(ctx, '1001', 'myvalue').should.be.rejectedWith(/The waiting list ammend 1001 already exists/);
        });

    });

    describe('#readWaitingListAmmend', () => {

        it('should return a waiting list ammend', async () => {
            await contract.readWaitingListAmmend(ctx, '1001').should.eventually.deep.equal({ value: 'waiting list ammend 1001 value' });
        });

        it('should throw an error for a waiting list ammend that does not exist', async () => {
            await contract.readWaitingListAmmend(ctx, '1003').should.be.rejectedWith(/The waiting list ammend 1003 does not exist/);
        });

    });

    describe('#updateWaitingListAmmend', () => {

        it('should update a waiting list ammend', async () => {
            await contract.updateWaitingListAmmend(ctx, '1001', 'waiting list ammend 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"waiting list ammend 1001 new value"}'));
        });

        it('should throw an error for a waiting list ammend that does not exist', async () => {
            await contract.updateWaitingListAmmend(ctx, '1003', 'waiting list ammend 1003 new value').should.be.rejectedWith(/The waiting list ammend 1003 does not exist/);
        });

    });

    describe('#deleteWaitingListAmmend', () => {

        it('should delete a waiting list ammend', async () => {
            await contract.deleteWaitingListAmmend(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a waiting list ammend that does not exist', async () => {
            await contract.deleteWaitingListAmmend(ctx, '1003').should.be.rejectedWith(/The waiting list ammend 1003 does not exist/);
        });

    });

});