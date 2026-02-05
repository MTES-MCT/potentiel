import { afterEach, describe, it } from 'node:test';

import { expect } from 'chai';
import winston from 'winston';

import { getLogger } from './getLogger.js';
import { consoleTransport } from './winston/console.transport.js';
import { initLogger, resetLogger } from './logger.js';
import { createLogger } from './winston/createLogger.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logMock = (calls: string[]) => (info: any, next: any) => calls.push(info.message) && next();

describe('winston-logger', () => {
  afterEach(() => {
    resetLogger();
  });

  it('logs the correct format without meta', () => {
    const calls: string[] = [];
    initLogger(
      createLogger({
        level: 'debug',
        transports: [consoleTransport({ log: logMock(calls) })],
      }),
    );
    const logger = getLogger('serviceName');

    logger.info('hello');

    expect(calls[0].trim()).to.eq('hello | Service(serviceName) | Metadata({})');
  });

  it('logs the correct format with meta', () => {
    const calls: string[] = [];
    initLogger(
      createLogger({
        level: 'debug',
        transports: [consoleTransport({ log: logMock(calls) })],
      }),
    );
    const logger = getLogger('serviceName');

    logger.info('hello', { foo: 'bar', baz: 1 });

    expect(calls[0].trim()).to.eq('hello | Service(serviceName) | Metadata({"foo":"bar","baz":1})');
  });

  it('logs the correct format with default meta', () => {
    const calls: string[] = [];
    initLogger(
      createLogger({
        level: 'debug',
        transports: [consoleTransport({ log: logMock(calls) })],
        defaultMeta: {
          appName: 'test',
        },
      }),
    );
    const logger = getLogger('serviceName');

    logger.info('hello', { foo: 'bar', baz: 1 });

    expect(calls[0].trim()).to.eq(
      `hello | Service(serviceName) | Metadata({"appName":"test","foo":"bar","baz":1})`,
    );
  });

  it('logs the correct level', () => {
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
