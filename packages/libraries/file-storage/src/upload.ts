import { S3 } from 'aws-sdk';

let client: S3 | undefined;

export const upload = (filePath: string, content: Buffer) => {
  if (!client) {
    const endpoint = process.env.S3_ENDPOINT || '';

    client = new S3({
      endpoint,
    });
  }

  const bucket = process.env.S3_BUCKET || '';

  client.upload({
    Bucket: bucket,
    Key: filePath,
    Body: content,
  });
};
