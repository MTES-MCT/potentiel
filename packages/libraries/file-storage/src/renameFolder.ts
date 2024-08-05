import { basename, join } from 'node:path';

import { renameFile } from './renameFile';
import { getFiles } from './getFiles';

/**
 * Renames a file in the same bucket
 * Do not use in domain, this is intended for CLI utility
 **/
export const renameFolder = async (fromFolderName: string, toFolderName: string) => {
  const files = await getFiles(fromFolderName);

  for (const fromFileName of files) {
    const toFileName = join(toFolderName, basename(fromFileName));
    await renameFile(fromFileName, toFileName);
  }
};
