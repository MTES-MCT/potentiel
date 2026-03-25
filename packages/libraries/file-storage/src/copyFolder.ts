import { join, basename } from 'path';

import { getFiles } from './getFiles.js';
import { copyFile } from './copyFile.js';

export const copyFolder = async (sourceKey: string, targetKey: string) => {
  const files = await getFiles(sourceKey);

  for (const fromFileName of files) {
    const toFileName = join(targetKey, basename(fromFileName));
    await copyFile(fromFileName, toFileName);
  }
};
