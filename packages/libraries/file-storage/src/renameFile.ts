import { copyFile } from './copyFile';
import { assertFileExists } from './assertFileExists';
import { deleteFile } from './deleteFile';

/**
 * Renames a file in the same bucket
 **/
export const renameFile = async (fromName: string, toName: string) => {
  await assertFileExists(fromName);

  await copyFile(fromName, toName);

  await deleteFile(fromName);
};
