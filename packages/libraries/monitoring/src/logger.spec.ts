import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getLogger, levels, resetLogger } from './logger';

describe('winston-logger', () => {
  beforeEach(() => {
    resetLogger();
    global.console = {
      log: jest.spyOn(console, 'log').mockImplementation(jest.fn()),
    } as any;
    process.env.LOGGER_LEVEL = undefined;
  });

  afterEach(() => {
    (global.console.log as jest.Mock).mockClear();
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
      };
      process.env.LOGGER_LEVEL = level;
      process.env.APPLICATION_NAME = applicationName;

      // Act
      const logger = getLogger();
      (logger as any)[level](message, meta);

      // Assert
      expect(global.console.log as any).toHaveBeenCalledTimes(1);
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
        expect(global.console.log as any).toHaveBeenCalledTimes(
          levels.indexOf(otherLevel) <= levels.indexOf(level) ? 1 : 0,
        );
      });
    }
  }
});
