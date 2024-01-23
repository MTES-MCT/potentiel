import { join } from 'path';
import { download } from './download';
import { getFiles } from './getFiles';
import { upload } from './upload';

export const copyFolder = async (sourceKey: string, targetKey: string) => {
  const files = await getFiles(sourceKey);

  for (const file of files) {
    const fileName = file.replace(`${sourceKey}/`, '');
    const fileContent = await download(file);

    await upload(join(targetKey, fileName), fileContent);
  }
};
