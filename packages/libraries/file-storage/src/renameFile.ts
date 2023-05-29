import { deleteFile } from './deleteFile';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const renameFile = async (filePath: string, newFilePath: string) => {
  await getClient()
    .copyObject({
      Bucket: getBucketName(),
      CopySource: `/${getBucketName()}/${filePath}`,
      Key: newFilePath,
    })
    .promise();

  console.log('OBJJJJJJJJJJ');

  await deleteFile(filePath);
};
