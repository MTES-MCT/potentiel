import { Command, Flags } from '@oclif/core';
import { z } from 'zod';

import { copyFile } from '@potentiel-libraries/file-storage';

import { parseCsvFile } from '../../helpers/parse-file';

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
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FilesCopy);
    const { parsedData: files } = await parseCsvFile(flags.path, schema);

    for (const file of files) {
      try {
        console.info(`Copying ${file.from} to ${file.to}`);
        await copyFile(file.from, file.to);
        console.debug(`Copied ${file.from} to ${file.to}`);
      } catch (e) {
        console.log(e);

        console.error(`Error while copying ${file.from}`, e);
      }
    }
    console.info(`Completed ${files.length} files`);
  }
}
