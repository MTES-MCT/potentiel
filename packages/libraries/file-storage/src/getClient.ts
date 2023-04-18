import { S3 } from 'aws-sdk';

let client: S3 | undefined;

export const getClient = () => {
  if (!client) {
    const endpoint = process.env.S3_ENDPOINT || '';

    client = new S3({
      endpoint,
    });
  }

  return client;
};
