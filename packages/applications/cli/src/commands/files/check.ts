import { Command, Flags } from '@oclif/core';
import { z } from 'zod';

import { fileExists } from '@potentiel-libraries/file-storage';

import { parseCsvFile, csvFlags } from '../../helpers/parse-file.js';
import { makeReporter, reporterFlags } from '../../helpers/reporter.js';

const schema = z.object({
  from: z.string(),
  to: z.string().optional(),
});

export default class FilesCheck extends Command {
  static override description = 'Check existance of a list of files from a CSV';
  static override examples: Command.Example[] = [
    {
      command: `npx cli files check --path ./file.csv --delimiter ','`,
      description: `change the delimiter to ','`,
    },
    {
      command: "npx cli files check --path ./file.csv --delimiter 'utf8'",
      description: 'change the encoding to utf8',
    },
    {
      command: 'npx cli files check --path ./file.csv --report out.csv --reportErrorsOnly',
      description: 'reports errors to out.csv',
    },
  ];

  static override args = {};

  static override flags = {
    path: Flags.file({
      exists: true,
      char: 'p',
      description: 'path to the csv file containing the files to check',
      required: true,
    }),
    field: Flags.string({
      description: 'name of the csv field containing the file to check',
      default: 'from',
    }),
    ...csvFlags,
    ...reporterFlags,
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FilesCheck);
    const { parsedData: files } = await parseCsvFile(flags.path, schema, {
      delimiter: flags.delimiter,
      encoding: flags.encoding,
    });

    const reporter = await makeReporter(flags);

    for (const file of files) {
      const field = flags.field as keyof z.infer<typeof schema>;
      const filename = file[field];
      if (!filename) {
        console.info(`Missing filename`);
        continue;
      }
      console.info(`Checking ${filename}`);
      const exists = await fileExists(filename);
      if (exists) {
        await reporter.success(filename);
      } else {
        await reporter.error(filename);
      }
    }
    console.info(`Checked ${files.length} files`);
  }
}
