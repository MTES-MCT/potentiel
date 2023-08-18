import { S3 } from '@aws-sdk/client-s3';

let client: S3 | undefined;

export const getClient = () => {
  if (!client) {
    const endpoint = process.env.S3_ENDPOINT || '';

    client = new S3({
      endpoint,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
    });
  }

  return client;
};
