import { Readable } from 'stream';
import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { FichierInexistant } from './fichierInexistant.error';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const download = async (filePath: string) => {
  try {
    const result = await getClient().send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: filePath }),
    );
    return Readable.from((await result.Body?.transformToByteArray()) ?? []);
  } catch (e) {
    throw new FichierInexistant();
  }
};
