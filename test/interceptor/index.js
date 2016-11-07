import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import INTERCEPTOR from '../../src/interceptor';

chai.should();
chai.use(sinonChai);

describe('Interceptor framework', () => {

  it('should intercept method before', () => {
    let value = 0;
    const test = {
      foo: (a, b, c) => value + a + b + c,
      before: () => {
        value += 1;
      }
    };
    sinon.spy(test, 'before');

    INTERCEPTOR.before(test, 'foo', test.before);
    const returnValue = test.foo(1, 2, 3);

    expect(test.before).to.have.been.calledWith(1, 2, 3);
    // value should be incremented before execution of foo
    expect(returnValue).to.equal(7);
    expect(value).to.equal(1);

    test.before.restore();
  });

  it('should intercept method after', () => {
    let value = 0;
    const test = {
      foo: (a, b, c) => value + a + b + c,
      after: () => {
        value += 1;
      }
    };
    sinon.spy(test, 'after');

    INTERCEPTOR.after(test, 'foo', test.after);
    const returnValue = test.foo(1, 2, 3);

    expect(test.after).to.have.been.calledWith(1, 2, 3);
    // value should be incremented after execution of foo
    expect(returnValue).to.equal(6);
    expect(value).to.equal(1);

    test.after.restore();
  });

  it('should reset intercepted methods', () => {
    let value = 0;
    const test = {
      foo: (a, b, c) => value + a + b + c,
      before: () => {
        value += 1;
      }
    };
    sinon.spy(test, 'before');

    INTERCEPTOR.before(test, 'foo', test.before);
    INTERCEPTOR.before(test, 'foo', test.before);
    let returnValue = test.foo(1, 2, 3);

    expect(test.before).to.have.been.calledWith(1, 2, 3);
    // value should be incremented twice before execution of foo
    expect(returnValue).to.equal(8);
    expect(value).to.equal(2);

    value = 0;
    INTERCEPTOR.revert();
    returnValue = test.foo(1, 2, 3);
    // value should not be incremented as interceptors should have been reverted
    expect(returnValue).to.equal(6);
    expect(value).to.equal(0);

    test.before.restore();
  });

});
