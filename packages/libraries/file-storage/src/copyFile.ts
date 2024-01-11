import { download } from './download';
import { upload } from './upload';

export const copyFile = async (sourceKey: string, targetKey: string) => {
  const content = await download(sourceKey);
  await upload(targetKey, content);
};
