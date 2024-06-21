import { Command, Flags } from '@oclif/core';

import { renommerFichiers as renameFiles } from './rename-files';
import { loadFiles } from './load-files';

export default class FilesRename extends Command {
  static override args = {};

  static override description =
    'Rename a list of files based on a csv with the list of renamings to do';

  static override examples = [];

  static override flags = {
    path: Flags.string({
      char: 'p',
      description: 'path to the csv file containing the files to rename',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(FilesRename);
    const files = await loadFiles(flags.path);

    await renameFiles({ files });
  }
}
