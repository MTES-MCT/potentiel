import { basename, join } from 'node:path';

import { copyFile } from './copyFile.js';
import { getFiles } from './getFiles.js';

export const copyFilesFromFolder = async (sourceKey: string, targetKey: string) => {
  const files = await getFiles(sourceKey);

  for (const fromFileName of files) {
    const toFileName = join(targetKey, basename(fromFileName));
    await copyFile(fromFileName, toFileName);
  }
};

export const copyFolder = async (sourceKey: string, targetKey: string) => {
  const files = await getFiles(sourceKey);

  for (const fromKey of files) {
    const relativePath = fromKey.startsWith(sourceKey)
      ? fromKey.slice(sourceKey.length)
      : basename(fromKey);

    const toKey = join(targetKey, relativePath);

    await copyFile(fromKey, toKey);
  }
};
