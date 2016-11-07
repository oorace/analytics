/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
export class Logger {

  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      this.underlying = require('loglevel');
      this.underlying.enableAll();
      this.underlying.info('Logging enabled');
    }
  }

  callUnderlying(level, ...args) {
    if (process.env.NODE_ENV !== 'production') {
      this.underlying[level](...args);
    }
  }

  trace(...args) {
    this.callUnderlying('trace', ...args);
  }

  debug(...args) {
    this.callUnderlying('debug', ...args);
  }

  info(...args) {
    this.callUnderlying('info', ...args);
  }

  warn(...args) {
    this.callUnderlying('warn', ...args);
  }

  error(...args) {
    this.callUnderlying('error', ...args);
  }

}

export default new Logger();
