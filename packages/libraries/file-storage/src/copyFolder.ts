import { basename, join } from 'node:path';

import { copyFile } from './copyFile.js';
import { getFiles } from './getFiles.js';

export const copyFolder = async (sourceKey: string, targetKey: string) => {
  const files = await getFiles(sourceKey);

  for (const fromFileName of files) {
    const toFileName = join(targetKey, basename(fromFileName));
    await copyFile(fromFileName, toFileName);
  }
};
