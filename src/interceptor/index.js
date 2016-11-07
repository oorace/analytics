import LOG from '../logger';

export class InterceptedMethod {

  constructor(object, methodName, beforeFunction, afterFunction) {
    this.object = object;
    this.methodName = methodName;
    this.originalMethod = object[methodName];

    if (!this.originalMethod) {
      LOG.error('Couldnt intercept method', this.methodName, 'on object', this.object, ': the method doesn\'t exist');
      return;
    }

    const self = this;
    this.object[this.methodName] = (...args) => { // eslint-disable-line no-param-reassign
      if (beforeFunction) {
        self.traceInterception('before', self.object, self.methodName, args);
        beforeFunction.apply(self.object, args);
      }
      const returnValue = this.originalMethod.apply(object, args);
      if (afterFunction) {
        self.traceInterception('after', self.object, self.methodName, args);
        afterFunction.apply(self.object, args);
      }
      return returnValue;
    };

    if (beforeFunction) {
      LOG.debug('Added before interceptor', beforeFunction, 'on', this.object, '.', this.methodName, '()');
    }

    if (afterFunction) {
      LOG.debug('Added after interceptor', afterFunction, 'on', this.object, '.', this.methodName, '()');
    }
  }

  traceInterception(type, args) {
    const params = [];
    for (let i = 0; i < args.length; i += 1) {
      if (i > 0) {
        params.push(',');
      }
      params.push(args[i]);
    }
    LOG.debug('Intercepted', type, this.object, '.', this.methodName, '(', ...params, ')');
  }

  revert() {
    this.object[this.methodName] = this.originalMethod;
    LOG.debug('Reverting intercepted method', this.object, '.', this.methodName, '() to ', this.originalMethod);
  }

}

export class Interceptor {

  constructor() {
    this.intercepted = [];
  }

  before(object, method, fn) {
    this.intercepted.push(new InterceptedMethod(object, method, fn, null));
  }

  after(object, method, fn) {
    this.intercepted.push(new InterceptedMethod(object, method, null, fn));
  }

  revert() {
    LOG.debug('Reverting intercepted methods');
    while (this.intercepted.length > 0) {
      const index = this.intercepted.length - 1;
      this.intercepted[index].revert();
      this.intercepted.splice(index, 1);
    }
  }

}

export default new Interceptor();
