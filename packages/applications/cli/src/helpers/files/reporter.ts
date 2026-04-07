import fs from 'fs/promises';

import { Flags } from '@oclif/core';

export const reporterFlags = {
  report: Flags.file({
    description: 'the name of the file to report to',
  }),
  reportErrorsOnly: Flags.boolean({
    description: `only outputs to the csv file`,
    dependsOn: ['report'],
  }),
};

type Reporter = {
  success: (obj: string | Record<string, unknown>) => void | Promise<void>;
  error: (obj: string | Record<string, unknown>, error?: unknown) => void | Promise<void>;
  close: () => void | Promise<void>;
};

const consoleReporter: Reporter = {
  success: (obj) => {
    console.log('✅', obj);
  },
  error: (obj, error) => {
    console.log('❌', obj, error);
  },
  close: () => {},
};

const makeFileReporter = async (filePath: string) => {
  // create or overwrite file
  await fs.writeFile(filePath, '');
  const resultsFile = await fs.open(filePath, 'a');
  return {
    report: (content: string) => resultsFile.appendFile(content + '\n'),
    close: () => resultsFile.close(),
  };
};

const makeCsvReporter = async (filePath: string, reportErrorsOnly: boolean): Promise<Reporter> => {
  const fileReporter = await makeFileReporter(filePath);
  return {
    success: async (value) => {
      if (reportErrorsOnly) {
        return;
      }
      await fileReporter.report(['success', value, ''].join(','));
    },
    error: async (value, error) => {
      await fileReporter.report(
        ['error', value, (error as Error)?.message].filter(Boolean).join(','),
      );
    },
    close: fileReporter.close,
  };
};

export const makeReporter = async ({
  report,
  reportErrorsOnly,
}: {
  report: string | undefined;
  reportErrorsOnly: boolean;
}): Promise<Reporter> => {
  const reporters = [consoleReporter];
  if (report) {
    reporters.push(await makeCsvReporter(report, reportErrorsOnly));
  }

  return {
    success: async (obj) => {
      for (const reporter of reporters) {
        await reporter.success(obj);
      }
    },
    error: async (obj, error) => {
      for (const reporter of reporters) {
        await reporter.error(obj, error);
      }
    },
    close: async () => {
      for (const reporter of reporters) {
        await reporter.close();
      }
    },
  };
};
