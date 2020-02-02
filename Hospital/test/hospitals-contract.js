/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HospitalsContract } = require('..');
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

describe('HospitalsContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HospitalsContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"hospitals 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"hospitals 1002 value"}'));
    });

    describe('#hospitalsExists', () => {

        it('should return true for a hospitals', async () => {
            await contract.hospitalsExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a hospitals that does not exist', async () => {
            await contract.hospitalsExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHospitals', () => {

        it('should create a hospitals', async () => {
            await contract.createHospitals(ctx, '1003', 'hospitals 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"hospitals 1003 value"}'));
        });

        it('should throw an error for a hospitals that already exists', async () => {
            await contract.createHospitals(ctx, '1001', 'myvalue').should.be.rejectedWith(/The hospitals 1001 already exists/);
        });

    });

    describe('#readHospitals', () => {

        it('should return a hospitals', async () => {
            await contract.readHospitals(ctx, '1001').should.eventually.deep.equal({ value: 'hospitals 1001 value' });
        });

        it('should throw an error for a hospitals that does not exist', async () => {
            await contract.readHospitals(ctx, '1003').should.be.rejectedWith(/The hospitals 1003 does not exist/);
        });

    });

    describe('#updateHospitals', () => {

        it('should update a hospitals', async () => {
            await contract.updateHospitals(ctx, '1001', 'hospitals 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"hospitals 1001 new value"}'));
        });

        it('should throw an error for a hospitals that does not exist', async () => {
            await contract.updateHospitals(ctx, '1003', 'hospitals 1003 new value').should.be.rejectedWith(/The hospitals 1003 does not exist/);
        });

    });

    describe('#deleteHospitals', () => {

        it('should delete a hospitals', async () => {
            await contract.deleteHospitals(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a hospitals that does not exist', async () => {
            await contract.deleteHospitals(ctx, '1003').should.be.rejectedWith(/The hospitals 1003 does not exist/);
        });

    });

});