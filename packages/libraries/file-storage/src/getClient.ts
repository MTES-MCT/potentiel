import { S3 } from 'aws-sdk';

let client: S3 | undefined;

export const getClient = () => {
  if (!client) {
    const endpoint = process.env.S3_ENDPOINT || '';

    client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
      endpoint,
    });
  }

  return client;
};
