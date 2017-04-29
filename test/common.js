import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

global.chai = chai;
global.chaiAsPromised = chaiAsPromised;

chai.use(global.chaiAsPromised);

global.sinon = sinon;
global.expect = chai.expect;
global.assert = chai.assert;
global.should = chai.should();
