import { getBucketName } from './getBucketName';
import { getClient } from './getClient';
import { FichierInexistant } from './fichierInexistant.error';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const download = async (filePath: string) => {
  try {
    const result = await getClient().send(
      new GetObjectCommand({ Bucket: getBucketName(), Key: filePath }),
    );

    if (!result.Body) {
      throw new FichierInexistant();
    }

    return result.Body.transformToWebStream();
  } catch (e) {
    throw new FichierInexistant();
  }
};
