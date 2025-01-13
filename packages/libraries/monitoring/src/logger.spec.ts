import { afterEach, describe, it } from 'node:test';

import { expect } from 'chai';
import winston from 'winston';

import { getLogger } from './getLogger';
import { consoleTransport } from './winston/console.transport';
import { initLogger, resetLogger } from './logger';
import { createLogger } from './winston/createLogger';

const logMock = (calls: string[]) => (info: any, next: any) => calls.push(info.message) && next();

describe('winston-logger', () => {
  afterEach(() => {
    resetLogger();
  });

  it('logs the correct format', () => {
    const calls: string[] = [];
    initLogger(
      createLogger({
        level: 'debug',
        transports: [consoleTransport({ log: logMock(calls) })],
      }),
    );
    const logger = getLogger('serviceName');

    logger.info('hello', { foo: 'bar', baz: 1 });

    expect(calls[0].trim()).to.eq('hello | Service(serviceName) | Metadata({foo="bar"} {baz=1})');
  });

  it('logs the correct level', async () => {
    const calls: string[] = [];
    initLogger(
      createLogger({
        level: 'warn',
        transports: [new winston.transports.Console({ log: logMock(calls) })],
      }),
    );
    const logger = getLogger();

    logger.debug('hello debug');
    logger.info('hello info');
    logger.warn('hello warn');
    logger.error('hello error');

    expect(calls).to.deep.eq(['hello warn', 'hello error']);
  });
});
