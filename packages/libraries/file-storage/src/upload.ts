import { getClient } from './getClient';

export const upload = async (filePath: string, content: Buffer) => {
  const bucket = process.env.S3_BUCKET || '';

  return new Promise<void>((resolve, reject) => {
    getClient().upload(
      {
        Bucket: bucket,
        Key: filePath,
        Body: content,
      },
      (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      },
    );
  });
};
