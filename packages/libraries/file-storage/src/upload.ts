import { getClient } from './getClient';

export const upload = async (filePath: string, content: Buffer) => {
  const bucket = process.env.S3_BUCKET || '';

  await getClient()
    .upload({
      Bucket: bucket,
      Key: filePath,
      Body: content,
    })
    .promise();
};
