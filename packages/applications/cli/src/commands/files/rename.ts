import { Command, Flags } from '@oclif/core';
import { z } from 'zod';

import { parseCsvFile, csvFlags } from '../../helpers/parse-file.js';
import { makeReporter, reporterFlags } from '../../helpers/reporter.js';
import { renameFile } from '../../helpers/renameFile.js';

const schema = z.object({
  from: z.string(),
  to: z.string(),
});

export default class FilesRename extends Command {
  static override description =
    'Rename a list of files based on a CSV file that contains the list of new names.';

  static override args = {};

  static override flags = {
    path: Flags.file({
      exists: true,
      char: 'p',
      description: 'path to the existing csv file containing the files to rename',
      required: true,
    }),
    ...csvFlags,
    ...reporterFlags,
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FilesRename);
    const { parsedData: files } = await parseCsvFile(flags.path, schema, {
      delimiter: flags.delimiter,
      encoding: flags.encoding,
    });
    const reporter = await makeReporter(flags);

    for (const file of files) {
      try {
        console.info(`Renaming ${file.from} to ${file.to}`);
        await renameFile(file.from, file.to);
        await reporter.success(file.from);
      } catch (e) {
        await reporter.error(file.from, e);
      }
    }
    await reporter.close();
    console.info(`Completed ${files.length} files`);
  }
}
