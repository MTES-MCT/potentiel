import { deleteFile } from './deleteFile';
import { download } from './download';
import { upload } from './upload';

export const renameFile = async (oldFilePath: string, newFilePath: string) => {
  const fileContent = await download(oldFilePath);
  await upload(newFilePath, fileContent);
  await deleteFile(oldFilePath);
};
