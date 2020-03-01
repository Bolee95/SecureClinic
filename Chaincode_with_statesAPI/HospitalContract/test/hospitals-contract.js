/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HospitalContract } = require('..');
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

describe('HospitalContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HospitalContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"Hospital 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"Hospital 1002 value"}'));
    });

    describe('#HospitalExists', () => {

        it('should return true for a Hospital', async () => {
            await contract.HospitalExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a Hospital that does not exist', async () => {
            await contract.HospitalExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHospital', () => {

        it('should create a Hospital', async () => {
            await contract.createHospital(ctx, '1003', 'Hospital 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"Hospital 1003 value"}'));
        });

        it('should throw an error for a Hospital that already exists', async () => {
            await contract.createHospital(ctx, '1001', 'myvalue').should.be.rejectedWith(/The Hospital 1001 already exists/);
        });

    });

    describe('#readHospital', () => {

        it('should return a Hospital', async () => {
            await contract.readHospital(ctx, '1001').should.eventually.deep.equal({ value: 'Hospital 1001 value' });
        });

        it('should throw an error for a Hospital that does not exist', async () => {
            await contract.readHospital(ctx, '1003').should.be.rejectedWith(/The Hospital 1003 does not exist/);
        });

    });

    describe('#updateHospital', () => {

        it('should update a Hospital', async () => {
            await contract.updateHospital(ctx, '1001', 'Hospital 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"Hospital 1001 new value"}'));
        });

        it('should throw an error for a Hospital that does not exist', async () => {
            await contract.updateHospital(ctx, '1003', 'Hospital 1003 new value').should.be.rejectedWith(/The Hospital 1003 does not exist/);
        });

    });

    describe('#deleteHospital', () => {

        it('should delete a Hospital', async () => {
            await contract.deleteHospital(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a Hospital that does not exist', async () => {
            await contract.deleteHospital(ctx, '1003').should.be.rejectedWith(/The Hospital 1003 does not exist/);
        });

    });

});