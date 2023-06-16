import { deleteFile } from './delete';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';

export const renameFile = async (filePath: string, newFilePath: string) => {
  await getClient()
    .copyObject({
      Bucket: getBucketName(),
      CopySource: encodeURI(`/${getBucketName()}/${filePath}`),
      Key: newFilePath,
    })
    .promise();

  await deleteFile(filePath);
};
