/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { FacilityContract } = require('..');
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

describe('FacilityContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new FacilityContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"facility 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"facility 1002 value"}'));
    });

    describe('#facilityExists', () => {

        it('should return true for a facility', async () => {
            await contract.facilityExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a facility that does not exist', async () => {
            await contract.facilityExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createFacility', () => {

        it('should create a facility', async () => {
            await contract.createFacility(ctx, '1003', 'facility 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"facility 1003 value"}'));
        });

        it('should throw an error for a facility that already exists', async () => {
            await contract.createFacility(ctx, '1001', 'myvalue').should.be.rejectedWith(/The facility 1001 already exists/);
        });

    });

    describe('#readFacility', () => {

        it('should return a facility', async () => {
            await contract.readFacility(ctx, '1001').should.eventually.deep.equal({ value: 'facility 1001 value' });
        });

        it('should throw an error for a facility that does not exist', async () => {
            await contract.readFacility(ctx, '1003').should.be.rejectedWith(/The facility 1003 does not exist/);
        });

    });

    describe('#updateFacility', () => {

        it('should update a facility', async () => {
            await contract.updateFacility(ctx, '1001', 'facility 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"facility 1001 new value"}'));
        });

        it('should throw an error for a facility that does not exist', async () => {
            await contract.updateFacility(ctx, '1003', 'facility 1003 new value').should.be.rejectedWith(/The facility 1003 does not exist/);
        });

    });

    describe('#deleteFacility', () => {

        it('should delete a facility', async () => {
            await contract.deleteFacility(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a facility that does not exist', async () => {
            await contract.deleteFacility(ctx, '1003').should.be.rejectedWith(/The facility 1003 does not exist/);
        });

    });

});