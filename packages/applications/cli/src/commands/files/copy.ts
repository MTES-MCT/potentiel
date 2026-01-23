import { Command, Flags } from '@oclif/core';
import { z } from 'zod';

import { copyFile } from '@potentiel-libraries/file-storage';

import { csvFlags, parseCsvFile } from '../../helpers/parse-file.js';
import { makeReporter, reporterFlags } from '../../helpers/reporter.js';

const schema = z.object({
  from: z.string(),
  to: z.string(),
});

export default class FilesCopy extends Command {
  static override description =
    'Copy a list of files based on a CSV file that contains the list of new names.';

  static override args = {};

  static override flags = {
    path: Flags.string({
      char: 'p',
      description: 'path to the csv file containing the files to copy',
      required: true,
    }),
    ...csvFlags,
    ...reporterFlags,
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FilesCopy);
    const { parsedData: files } = await parseCsvFile(flags.path, schema, {
      delimiter: flags.delimiter,
      encoding: flags.encoding,
    });
    const reporter = await makeReporter(flags);

    for (const file of files) {
      try {
        console.info(`Copying ${file.from} to ${file.to}`);
        await copyFile(file.from, file.to);
        await reporter.success(file.from);
      } catch (e) {
        await reporter.error(file.to, e);
      }
    }
    await reporter.close();

    console.info(`Completed ${files.length} files`);
  }
}
