import { afterEach, beforeEach, describe, it, mock } from 'node:test';

import { expect } from 'chai';

import { getLogger, resetLogger, levels } from './logger';

describe('winston-logger', () => {
  const logMock = mock.fn();
  beforeEach(() => {
    resetLogger();
    global.console = { log: logMock } as any;
    process.env.LOGGER_LEVEL = undefined;
  });

  afterEach(() => {
    logMock.mock.resetCalls();
  });
  // Test all cases for non error logs
  for (const level of levels) {
    it(`Etant donnée une configuration du logger en mode '${level}'
        Quand le logger log en mode '${level}'
        Alors le log est présent dans le terminal
      `, () => {
      // Arrange
      const applicationName = 'an application name';
      const message = level === 'error' ? new Error('an error') : 'a message';
      const meta = {
        test: 'a test meta',
        deep: { foo: 'bar' },
      };
      process.env.LOGGER_LEVEL = level;
      process.env.APPLICATION_NAME = applicationName;

      // Act
      const logger = getLogger();
      (logger as any)[level](message, meta);

      // Assert
      expect(logMock.mock.callCount()).to.eq(1);
      expect(logMock.mock.calls[0].arguments[0]).to.contain(
        `${level === 'error' ? 'an error' : 'a message'} | Service(an application name) | Metadata({test="a test meta"} {deep={"foo":"bar"}})`,
      );
    });

    for (const otherLevel of levels.filter((l) => l !== level)) {
      it(`Etant donnée une configuration du logger en mode '${level}'
        Quand le logger log en mode '${otherLevel}'
        Alors le log ${
          levels.indexOf(otherLevel) <= levels.indexOf(level) ? 'est' : "n'est pas"
        } présent dans le terminal
      `, () => {
        // Arrange
        const applicationName = 'an application name';
        const message = level === 'error' ? new Error('an error') : 'a message';
        const meta = {
          test: 'a test meta',
        };
        process.env.LOGGER_LEVEL = level;
        process.env.APPLICATION_NAME = applicationName;

        // Act
        const logger = getLogger();
        (logger as any)[otherLevel](message, meta);

        // Assert
        expect(logMock.mock.callCount()).to.eq(
          levels.indexOf(otherLevel) <= levels.indexOf(level) ? 1 : 0,
        );
      });
    }
  }
});
