import Transport from 'winston-transport';
import winston from 'winston';

export class TestTransport extends Transport {
  #buffer: winston.Logform.TransformableInfo[];
  constructor() {
    super({ level: 'debug' });
    this.#buffer = [];
  }

  log(info: winston.Logform.TransformableInfo, callback: Function) {
    this.#buffer.push(info);

    setImmediate(() => this.emit('logged', info));
    if (typeof callback === 'function') {
      callback();
    }
  }

  dumpToConsole(printer = console.log) {
    if (this.#buffer.length === 0) {
      printer('(no log entries)');
      return;
    }
    for (const line of this.#buffer) {
      printer(winston.format.simple().transform(line));
    }
  }

  clear() {
    this.#buffer = [];
  }
}
