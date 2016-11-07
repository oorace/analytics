import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import LOG from '../../src/logger';

chai.should();
chai.use(sinonChai);

describe('Logging framework', () => {

  it('should call underlying logging framework', () => {
    sinon.spy(LOG.underlying, 'info');
    LOG.info('test');
    expect(LOG.underlying.info).to.have.been.calledWith('test');
    LOG.underlying.info.restore();
  });

});
